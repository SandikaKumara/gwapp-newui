'use server'

import prisma from "@/lib/db"
import sendEmail from "@/lib/email"
import { createTicketEmailTemplate } from "@/lib/emailTemplates"
import { fileUpload, uploadFileNew } from "@/lib/files"
import { getSession } from "@/lib/sessionActions"
import { getAdminUsers } from "./userActions"

export async function getTicketAction(id) {
    try {
        const session = await getSession()

        const ticket = await prisma.Ticket.findUnique({
            where: {
                id: id,
                ...(!session?.isAdmin && {
                    userId: session?.userId
                })
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        })

        // if (!session?.isAdmin) {

        //     if (!ticket) {
        //         return { type: 'error', message: 'Invalid ticket ID.' }
        //     }

        //     if (ticket?.userId !== session?.userId) {
        //         return { type: 'warning', message: 'You are not authorized to update this ticket.' }
        //     }
        // }


        return ticket
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching ticket. : ${err}` }
    }
}

export async function createTicketAction(formData) {
    const title = formData.get('title')
    const content = formData.get('content')
    const file = formData.get('file')
    const attachment = formData.get('attachment')

    const session = await getSession()

    const tenantId = formData.get('tenant') || session?.tenantId

    let filePath;
    let newFileName;

    try {
        // get the max slug id
        const lastTicket = await prisma.Ticket.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                slug: true
            }
        })

        // Generate the next slug
        let nextSlug = 1; // Default to 1 if no tickets exist
        if (lastTicket && lastTicket.slug) {
            const lastSlug = parseInt(lastTicket.slug, 10);
            if (!isNaN(lastSlug)) {
                nextSlug = lastSlug + 1;
            }
        }

        const result = await prisma.Ticket.create({
            data: {
                slug: nextSlug,
                title,
                content,
                status: 'CREATED',
                userId: session?.userId,
                tenantId: tenantId
            }
        })

        if (file && file.name && file.name !== 'undefined') {
            newFileName = result.id + '_' + file.name;
            filePath = '/file/' + newFileName;
        }

        if (filePath) {
            const fileUploadRes = await uploadFileNew(file, newFileName, "file")
            if (fileUploadRes.type !== 'success') {
                throw new Error(fileUploadRes.message)
            }

            await prisma.Ticket.update({
                where: {
                    id: result.id
                },
                data: {
                    attachment: filePath
                }
            })
        }

        //  send email to submitter
        const ticket = await getTicketAction(result?.id)

        // fetch admin users for sending emails to administrators
        const adminsUsers = await getAdminUsers()
        const ccArray = adminsUsers.map(admin => admin.email)

        sendEmail(ticket?.user?.email, 'New Ticket Created', 'New Ticket Created Successfully!', createTicketEmailTemplate(ticket), ccArray.join(','))

        return { type: 'success', message: `Successfully registered your ticket. Our representative will be contacted you soon. You inquiry ID is : ${result.id}.` }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the ticket : ${err}` }
    }
}


export async function editTicketAction(formData, id) {

}

export async function getTicketListAction(searchText) {
    const session = await getSession()
    let tenantId;
    let userId;

    if (!session?.isAdmin) {
        tenantId = session?.tenantId
        userId = session?.userId
    }

    try {
        const tickets = await prisma.Ticket.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchText
                        },
                    },
                    {
                        content: {
                            contains: searchText
                        }
                    },
                    {
                        status: {
                            contains: searchText
                        }
                    }

                ],
                ...(tenantId && {
                    AND: {
                        tenantId: tenantId
                    }
                }),
                ...(userId && {
                    AND: {
                        userId: userId
                    }
                })
            }
        })

        return tickets
    } catch (err) {
        return { type: 'error', message: `Error while fetching the Ticket list. : ${err}` }
    }
}
'use server'

import prisma from "@/lib/db"
import { uploadFileNew } from "@/lib/files"
import { getSession } from "@/lib/sessionActions"
import { revalidatePath } from "next/cache"
import { getTicketAction } from "./ticket"
import { getAdminUsers } from "./userActions"
import { updateTicketEmailTemplate } from "@/lib/emailTemplates"
import sendEmail from "@/lib/email"
import { getTenantAction } from "./tenant"

export const getTicketLog = async (id) => {
    try {
        const ticketLogs = await prisma.TicketLog.findMany({
            where: {
                ticketId: id
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { type: 'success', message: ticketLogs }
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching ticket log data. : ${err}` }
    }
}


export const createTicketLog = async (formData, ticketId) => {
    const note = formData.get('note')
    const file = formData.get('file')
    const resolved = formData.get('resolved')

    const session = await getSession()

    let filePath;
    let newFileName;

    try {

        if (!session?.isAdmin) {

            const ticket = await getTicketAction(ticketId);

            if (!ticket) {
                return { type: 'error', message: 'Invalid ticket ID.' }
            }

            if (ticket?.userId !== session?.userId) {
                return { type: 'warning', message: 'You are not authorized to update this ticket.' }
            }
        }

        const result = await prisma.TicketLog.create({
            data: {
                note,
                ticketId,
                userId: session?.userId
            }
        })

        let status;

        if (resolved === 'on') {
            status = 'CLOSED'
        } else {
            status = 'IN-PROGRESS'
        }

        await prisma.Ticket.update({
            where: {
                id: ticketId
            },
            data: {
                status
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

            await prisma.TicketLog.update({
                where: {
                    id: result.id
                },
                data: {
                    attachment: filePath
                }
            })
        }

        //  send email to submitter
        const ticket = await getTicketAction(ticketId)

        // fetch admin users for sending emails to administrators
        const adminsUsers = await getAdminUsers()
        const ccArray = adminsUsers.map(admin => admin.email)

        sendEmail(ticket?.user?.email, 'Ticket Update Notification', '', updateTicketEmailTemplate(ticket), ccArray.join(','))

        return { type: 'success', message: 'Successfully commented to the ticket.' }

    } catch (err) {
        return { type: 'error', message: `An error occurred while creating the ticket log. : ${err}` }
    }
}
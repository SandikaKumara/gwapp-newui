"use server"

import prisma from "@/lib/db"
import { getSession } from "@/lib/sessionActions"

export async function getNotificationListAction(searchText, isActive) {
    try {
        const notifications = await prisma.Notification.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: searchText
                        }
                    },
                    {
                        message: {
                            contains: searchText
                        }
                    }
                ],
                ...(isActive && {
                    AND: {
                        isActive: isActive
                    }
                })
            }
        })

        return notifications
    } catch (err) {
        return { type: 'error', message: `Error while fetching the Notification list. : ${err}` }
    }
}

export async function getNotificationAction(id) {
    try {
        const notification = await prisma.Notification.findUnique({
            where: {
                id: id
            }
        })

        return notification
    } catch (err) {
        return { type: 'error', message: `Error while fetching the Notification. : ${err}` }
    }
}

export async function createNotificationAction(formData) {
    const title = formData.get('title')
    const message = formData.get('message')
    const tenantId = formData.get('tenant')
    const userRole = formData.get('userRole')
    const user = formData.get('user')
    const isSendEmail = formData.get('isSendEmail')

    const session = await getSession()

    try {
        const data = {
            title,
            message,
            // ...((tenantId && tenantId !== '0') && { tenantId: tenantId }),
            // ...((userRole && userRole !== '0') && { userRoleId: userRole }),
            // ...((user && user !== '0') && { assignedUserId: user }),
            tenantId: tenantId === '0' ? null : tenantId,
            userRoleId: userRole === '0' ? null : userRole,
            assignedUserId: user === '0' ? null : user,
            createdById: session?.userId,
            isSendEmail: isSendEmail === 'true' ? true : false
        }

        const result = await prisma.Notification.create({
            data
        })

        return { type: 'success', message: `Successfully created a notification with the id : ${result.id}.`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the notification : ${err}` }
    }
}

export async function editNotificationAction(formData, id) {
    const title = formData.get('title')
    const message = formData.get('message')
    const tenantId = formData.get('tenant')
    const userRole = formData.get('userRole')
    const user = formData.get('user')
    const isSendEmail = formData.get('isSendEmail')

    console.log("isSendEmail: ", isSendEmail);


    const session = await getSession()

    try {
        const data = {
            title,
            message,
            tenantId: tenantId === '0' ? null : tenantId,
            userRoleId: userRole === '0' ? null : userRole,
            assignedUserId: user === '0' ? null : user,
            // ...((tenantId && tenantId !== '0') && { tenantId: tenantId }),
            // ...((userRole && userRole !== '0') && { userRoleId: userRole }),
            // ...((user && user !== '0') && { assignedUserId: user }),
            createdById: session?.userId,
            isSendEmail: isSendEmail === 'true' ? true : false
        }

        const result = await prisma.Notification.update({
            where: {
                id: id
            },
            data
        })

        return { type: 'success', message: `Successfully updated the notification.`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the notification : ${err}` }
    }
}
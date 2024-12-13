'use server'
import prisma from "@/lib/db";
import { getNotificationAction } from "./notification";
import { getUserUserRoleListAction } from "./userUserRole";
import { getUserRolesForTenant } from "./userRole";
import { getUsersOfTenant } from "./userTenant";
import sendEmail from "@/lib/email";
import { notificationEmailTemplate } from "@/lib/emailTemplates";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/sessionActions";


export async function getNotificationLogsAction(notificationId) {
    try {
        const logs = await prisma.NotificationLog.findMany({
            where: {
                notificationId: notificationId
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        return { type: 'success', message: logs }
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching notification logs. ${err.message}` }
    }
}


export async function generateNotificationUsersAction(id) {
    try {
        // validate notification exists
        const notification = await getNotificationAction(id)
        if (!notification) {
            return { type: 'error', message: 'No notification found.' }
        }

        // get the list of users
        const userList = await generateUserList(notification)

        //  delete existsing log entries
        await prisma.NotificationLog.deleteMany({
            where: {
                notificationId: id
            }
        })

        // create notificationLog entries
        const notificationLogs = userList.map(user => ({
            notificationId: id,
            userId: user,
        }))

        const result = await prisma.NotificationLog.createMany({
            data: notificationLogs,
        })

        if (result.count > 0) {
            await prisma.Notification.update({
                where: {
                    id: id
                },
                data: {
                    generated: true
                }
            })
        }

        return { type: 'success', message: `Inserted ${result.count} notification logs`, id: id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while creating notification logs. ${err}` }
    }
}

export async function sendNotificationsAction(id) {
    try {
        // validate notification exists
        const notification = await getNotificationAction(id)
        if (!notification) {
            return { type: 'error', message: 'No notification found.' }
        }

        const logs = await getNotificationLogsAction(id)

        if (logs.type != 'success') {
            return logs
        }

        if (logs.type === 'success' && logs.message.length == 0) {
            return { type: 'warning', message: 'No any record to send notifications.' }
        }

        // console.log(logs);

        logs.message.map(log => {
            // send email 
            if (notification.isSendEmail) {
                sendEmail(log.user?.email, 'New Announcement', '', notificationEmailTemplate({
                    name: log.user?.firstName + ' ' + log.user?.lastName,
                    title: notification?.title,
                    message: notification?.message
                }))
            }

            // update send status in notification log
            const updateStatus = updateNotificationLogSentStatus(log?.id)
            if (updateStatus.type === 'error') {
                throw new Error(updateStatus.message)
            }

        })

        // update notifiation sent status
        const result = updateNotificationSentStatus(notification?.id)
        if (result.type === 'error') {
            throw new Error(result.message)
        }

        // revalidatePath(`/dashboard/notification/${id}`)
        return { type: 'success', message: 'Successfully send notification to users.', id: notification?.id }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching the notification logs data. ${err.message}` }
    }
}


const generateUserList = async (notification) => {
    let listOfUsers = []

    // Specific user
    if (notification?.assignedUserId) {
        listOfUsers.push(notification?.assignedUserId)
    }

    // Users in user role
    if (!notification?.assignedUserId && notification?.userRoleId) {
        const userList = await getUserUserRoleListAction(notification?.userRoleId)

        if (userList) {
            const list = userList
                .filter((user) => user.user?.isActive)
                .map((user) => (user?.userId));
            listOfUsers = list
        }
    }

    // Users in tenant
    if (!notification?.assignedUserId && !notification?.userRoleId && notification?.tenantId) {
        const users = await getUsersOfTenant(notification?.tenantId);
        listOfUsers = users.filter(row => row.isActive).map(item => item.id)
    }

    // All users
    if (!notification?.assignedUserId && !notification?.userRoleId && !notification?.tenantId) {
        const users = await prisma.User.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true
            }

        })

        listOfUsers = users.map(row => row.id)
    }
    return listOfUsers
}


const updateNotificationLogSentStatus = async (id) => {
    try {
        await prisma.NotificationLog.update({
            where: {
                id: id
            },
            data: {
                sent: true
            }
        })
        return { type: 'success', message: 'Successfully updated sent status.' }
    } catch (err) {
        return { type: 'error', message: `An error occured while updating sent status. ${err.message}` }
    }
}


const updateNotificationSentStatus = async (id) => {
    try {
        await prisma.Notification.update({
            where: {
                id: id
            },
            data: {
                sent: true
            }
        })
        return { type: 'success', message: 'Successfully updated sent status.' }
    } catch (err) {
        return { type: 'error', message: `An error occured while updating sent status. ${err.message}` }
    }
}


export const getNotificationLogsForUser = async (searchText) => {
    const session = await getSession()

    try {
        const logs = await prisma.NotificationLog.findMany({
            where: {
                userId: session?.userId,
                sent: true,
                OR: [
                    {
                        notification: {
                            title: {
                                contains: searchText
                            }
                        }
                    },
                    {
                        notification: {
                            message: {
                                contains: searchText
                            }
                        }
                    }
                ],
            },
            include: {
                notification: {
                    select: {
                        title: true,
                        message: true,
                        createdAt: true
                    }
                }
            }
        })

        return { type: 'success', message: logs }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching notification logs from the database. ${err.message}` }
    }
}


export const updateReadNotificationLog = async (id) => {
    try {
        const notificationLog = await prisma.NotificationLog.findUnique({
            where: {
                id: id
            }
        })

        if (!notificationLog) {
            return { type: 'warning', message: 'Invalid notification log entry found.' }
        }

        await prisma.NotificationLog.update({
            where: {
                id: id
            },
            data: {
                read: true
            }
        })

        return { type: 'success', message: 'Successfully updated the read status.' }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching notification logs from the database. ${err.message}` }
    }
}
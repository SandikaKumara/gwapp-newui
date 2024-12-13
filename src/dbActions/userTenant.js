'use server'

import prisma from "@/lib/db"

export async function getUserTenantListAction(userId) {

    try {
        const userTenants = await prisma.UserTenant.findMany({
            where: {
                userId: userId
            },
            include: {
                tenant: {
                    select: {
                        name: true,
                        id: true,
                        isActive: true
                    }
                }
            }
        })

        return userTenants
    } catch (err) {
        return { type: 'error', message: `Error while fetching the user additional tenants. : ${err}` }
    }
}

export async function getUsersOfTenant(tenantId) {

    try {
        // get users from user model
        const users = await prisma.User.findMany({
            where: {
                tenantId: tenantId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                isActive: true
            }
        })

        // get users from userTenant model
        const userTenantUsers = await prisma.UserTenant.findMany({
            where: {
                tenantId: tenantId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        isActive: true
                    }
                }
            }
        })

        const usersFromUserTenant = userTenantUsers.map(userTenant => userTenant.user)
        const allUsers = [...users, ...usersFromUserTenant]
        return allUsers
    } catch (err) {
        return { type: 'error', message: `Error while fetching the users of tenant. : ${err}` }
    }
}


export async function createUserTenantAction(userId, tenantId) {

    try {
        const existUserTenant = await prisma.UserTenant.findUnique({
            where: {
                userId_tenantId: {
                    userId: userId,
                    tenantId: tenantId
                }
            }
        })

        if (existUserTenant) {
            return { type: 'warning', message: `Tenant already assigned to the user` }
        }

        const userTenant = await prisma.User.findUnique({
            where: {
                id: userId
            }
        })

        if (userTenant.tenantId === tenantId) {
            return { type: 'warning', message: `Tenant already assigned as the primary tenant for the user.` }
        }

        const result = await prisma.UserTenant.create({
            data: {
                userId,
                tenantId
            }
        })

        console.log(result);


        return { type: 'success', message: `Successfully assigned the tenant to the user.` }

    } catch (err) {
        return { type: 'error', message: `An error occurred while assigning the tenant to the user. : ${err}` }
    }
}


export async function deleteUserTenantAction(id) {
    try {
        const userTenant = await prisma.UserTenant.findUnique({
            where: {
                id: id
            }
        })

        if (!userTenant) return { type: 'warning', message: `Tenant assignment to the user not found` }

        const result = await prisma.UserTenant.delete({
            where: {
                id: id
            }
        })

        return { type: 'success', message: `Successfully removed tenant assignment to the user.` }
    } catch (err) {
        return { type: 'error', message: `An error occurred while removing the tenant assignment from the user.` }
    }
}
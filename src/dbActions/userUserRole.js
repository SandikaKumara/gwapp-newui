'use server'

import prisma from "@/lib/db"

export async function getUserUserRoleListAction(userRoleId) {
    try {
        const userUserRoles = await prisma.UserUserRole.findMany({
            where: {
                userRoleId: userRoleId
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

        return userUserRoles
    } catch (err) {
        return { type: 'error', message: `Error while fetching the user role assignments. : ${err}` }
    }
}


export async function createUserUserRole(userRoleId, userId) {
    // const userId = formData.get('user')
    // const userRoleId = formData.get('userRole')

    try {
        const existUserUserRole = await prisma.UserUserRole.findUnique({
            where: {
                userId_userRoleId: {
                    userId: userId,
                    userRoleId: userRoleId
                }
            }
        })

        if (existUserUserRole) {
            return { type: 'warning', message: `User Role already assigned to the user` }
        }

        const result = await prisma.UserUserRole.create({
            data: {
                userId,
                userRoleId
            }
        })

        return { type: 'success', message: `Successfully assigned the user role to the user.` }

    } catch (err) {
        return { type: 'error', message: `An error occurred while assigning the user role to the user. : ${err}` }
    }
}


export async function deleteUserUserRole(id) {
    try {
        const userUserRole = await prisma.UserUserRole.findUnique({
            where: {
                id: id
            }
        })

        if (!userUserRole) return { type: 'warning', message: `User Role assignment to the user not found` }

        const result = await prisma.UserUserRole.delete({
            where: {
                id: id
            }
        })

        return { type: 'success', message: `Successfully removed user role assignment to the user.` }
    } catch (err) {
        return { type: 'error', message: `An error occurred while removing the user role assignment from the user.` }
    }
}
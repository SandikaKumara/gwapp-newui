'use server'

import prisma from "@/lib/db"

export async function getUserRoleMenuListAction(userRoleId) {
    try {
        const userRoleMenus = await prisma.UserRoleMenu.findMany({
            where: {
                userRoleId: userRoleId
            }
        })

        return userRoleMenus
    } catch (err) {
        return { type: 'error', message: `Error while fetching the user role menus. : ${err}` }
    }
}


export async function getUserRolesByMenuAction(menuId) {
    try {
        const userRoles = await prisma.UserRoleMenu.findMany({
            where: {
                menuId: menuId
            },
            include: {
                userRole: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return userRoles
    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching user roles by menu. : ${err}` }
    }
}

export async function createUserRoleMenuAction(menuId, userRoleId) {
    // const userRoleId = formData.get('userRole')
    // const menuId = formData.get('menu')

    try {
        const existUserRoleMenu = await prisma.UserRoleMenu.findUnique({
            where: {
                userRoleId_menuId: {
                    userRoleId: userRoleId,
                    menuId: menuId
                }
            }
        })

        if (existUserRoleMenu) {
            return { type: 'warning', message: `Menu already assigned to the user role.` }
        }

        const result = await prisma.UserRoleMenu.create({
            data: {
                userRoleId,
                menuId
            }
        })

        return { type: 'success', message: `Successfully assigned the menu to the user role.` }

    } catch (err) {
        return { type: 'error', message: `An error occurred while assigning the menu to the user role. : ${err}` }
    }
}


export async function deleteUserRoleMenuAction(id) {
    try {
        const userRoleMenu = await prisma.UserRoleMenu.findUnique({
            where: {
                id: id
            }
        })

        if (!userRoleMenu) return { type: 'warning', message: `Menu assignment to the user role not found` }

        const result = await prisma.UserRoleMenu.delete({
            where: {
                id: id
            }
        })

        return { type: 'success', message: `Successfully removed menu assignment to the user role.` }
    } catch (err) {
        return { type: 'error', message: `An error occurred while removing the menu assignment from the user role.` }
    }
}
'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getMenuListAction(searchText, isActive, tenantId) {
    try {

        const menus = await prisma.Menu.findMany({
            where: {
                name: {
                    contains: searchText
                },
                ...(isActive && {
                    AND: {
                        isActive: isActive
                    }
                }),
                ...(tenantId && {
                    AND: {
                        tenantId: tenantId
                    }
                })
            },
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                },
                UserRoleMenu: {
                    include: {
                        userRole: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return menus

    } catch (err) {
        return { type: 'error', message: `Error while fetching the menu list. : ${err}` }
    }
}

export async function getMenuByIdAction(id) {

    try {
        const menu = await prisma.Menu.findUnique({
            where: {
                id: id,
            },
        });

        return menu;
    } catch (err) {
        return { type: 'error', message: `Error while fetching the menu. : ${err}` }
    }
}

export async function createMenuAction(formData) {
    const name = formData.get('name')
    const category = formData.get('category')
    const order = parseInt(formData.get('order'))
    const url = formData.get('url')
    const tenantId = formData.get('tenant')

    try {
        const existingMenu = await prisma.Menu.findUnique({
            where: {
                name_tenantId_category: {
                    name: name,
                    tenantId: tenantId,
                    category: category || ""
                }
            }
        })

        if (existingMenu) {
            return { type: 'warning', message: `Menu is exists with the name : , ${name}` }
        }

        const result = await prisma.Menu.create({
            data: {
                name,
                category,
                order,
                url,
                tenantId
            }
        });

        return { type: 'success', message: `Successfully registered the Menu : ${result.name}, assigned ID : ${result.id}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the menu : ${err}` }
    }
}


export async function editMenuAction(formData, id) {
    const name = formData.get('name')
    const category = formData.get('category')
    const order = parseInt(formData.get('order'))
    const url = formData.get('url')
    const tenantId = formData.get('tenant')

    try {
        const existsingMenu = await prisma.Menu.findUnique({
            where: {
                name_tenantId_category: {
                    name: name,
                    tenantId: tenantId,
                    category: category,
                },
                ...(id && {
                    NOT: {
                        id: id
                    }
                })
            }
        })

        if (existsingMenu) {
            return { type: 'warning', message: `Menu is exists with the name : , ${name}` }
        }

        const result = await prisma.Menu.update({
            where: {
                id
            },
            data: {
                name,
                category,
                order,
                url,
                tenantId,
            }
        })

        // revalidatePath(`/dashboard/menu/${id}`)

        return { type: 'success', message: `Successfully updated the menu : ${result.name}, assigned ID : ${result.id}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registring the menu : ${err}` }
    }
}


export async function enableDisableMenu(id) {

    try {
        // Fetch the current tenant to get the current 'active' status
        const menu = await prisma.Menu.findUnique({
            where: {
                id: id
            }
        });

        if (!menu) {
            throw new Error(`Menu with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedMenu = await prisma.Menu.update({
            where: {
                id: id
            },
            data: {
                isActive: !menu.isActive
            }
        });

        return { type: 'success', message: `Successfully updated status of the menu ${menu?.name}` }

    } catch (err) {
        return { type: 'error', message: "Error updating menu status:" }
    }
}
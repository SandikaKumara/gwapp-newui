'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getUserRoleListAction(searchText, isActive) {
    try {
        const userRoles = await prisma.UserRole.findMany({
            where: {
                name: {
                    contains: searchText
                },
            },
            ...(isActive && {
                AND: {
                    isActive: isActive
                }
            }),
            include: {
                tenant: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return userRoles
    } catch (err) {
        return { type: 'error', message: `Error while fetching the user role list. : ${err}` }
    }
}

export async function getUserRoleByIdAction(id) {
    try {
        const userRoles = await prisma.UserRole.findUnique({
            where: {
                id: id
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        return userRoles
    } catch (err) {
        return { type: 'error', message: `Error while fetching the user role list. : ${err}` }
    }
}


export async function getUserRolesForTenant(tenantId) {
    try {
        const tenantUserRoles = await prisma.UserRole.findMany({
            where: {
                tenantId: tenantId
            },
            select: {
                id: true,
                name: true,
                isActive: true
            }
        })
        return tenantUserRoles
    } catch (err) {
        return { type: 'error', message: `Error occurred while fetching the user roles related to Tenant : ${err}` }
    }
}


export async function createUserRoleAction(formData) {
    const name = formData.get('name')
    const tenantId = formData.get('tenant')

    try {
        const existingUserRole = await prisma.UserRole.findUnique({
            where: {
                name_tenantId: {
                    name: name,
                    tenantId: tenantId
                }
            }
        });

        if (existingUserRole) {
            return { type: 'warning', message: `User Role is exists with the name : , ${name}` }
        }

        const result = await prisma.UserRole.create({
            data: {
                name,
                tenantId
            }
        });

        return { type: 'success', message: `Successfully registered the user role : ${result.name}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the user role : ${err}` }
    }
}


export async function editUserRoleAction(formData, id) {
    const name = formData.get('name')
    const tenantId = formData.get('tenant')

    try {
        const existingUserRole = await prisma.UserRole.findUnique({
            where: {
                name_tenantId: {
                    name,
                    tenantId,
                },
                ...(id && {
                    NOT: {
                        id: id
                    }
                })
            }
        });

        if (existingUserRole) {
            return { type: 'warning', message: `User Role is exists with the name : , ${name}` }
        }

        const result = await prisma.UserRole.update({
            where: {
                id
            },
            data: {
                name,
            }
        });

        // revalidatePath(`/dashboard/userRole/${id}`)

        return { type: 'success', message: `Successfully updated the user role : ${result.name}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while updating the user role : ${err}` }
    }
}


export async function enableDisableUserRole(id) {

    try {
        // Fetch the current user role to get the current 'active' status
        const userRole = await prisma.UserRole.findUnique({
            where: {
                id: id
            }
        });

        if (!userRole) {
            throw new Error(`User Role with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedUserRole = await prisma.UserRole.update({
            where: {
                id: id
            },
            data: {
                isActive: !userRole.isActive
            }
        });

        return { type: 'success', message: `Successfully updated status of the user role ${tenant?.name}` }

    } catch (err) {
        return { type: 'error', message: "Error updating user role status:" }
    }
}



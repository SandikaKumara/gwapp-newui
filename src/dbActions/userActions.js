'use server'

import prisma from "@/lib/db"
import sendEmail from "@/lib/email"
import { generateRandomString, hashPassword } from "@/lib/password"
import { revalidatePath } from "next/cache"
import { getTenantAction } from "./tenant"
import { newUserEmailTemplate, userPasswordResetEmailTemplate } from "@/lib/emailTemplates"
import { getFile } from "@/lib/files"

export async function getUserListAction(searchText, isActive) {
    try {
        const users = await prisma.User.findMany({
            where: {
                firstName: {
                    contains: searchText
                }
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
        // return users

        const usersWithLogos = [];

        if (users) {
            for (const user of users) {
                const file = await getFile(user?.logoPath);
                usersWithLogos.push({
                    ...user,  // Spread the existing user information
                    logoFile: file?.image || "" // Add the fetched logo file to the user object
                });
            }

            // console.log(usersWithLogos); // List of users with appended logo files
        }


        return usersWithLogos

    } catch (err) {
        return { type: 'error', message: `Error while fetching the User list. : ${err}` }
    }
}


export async function getUserAction(email) {
    try {
        const user = await prisma.User.findUnique({
            where: {
                email: email.toLowerCase()
            },
            include: {
                tenant: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })

        return user;
    } catch (err) {
        return
    }
}

export async function getAdminUsers() {
    try {
        const users = await prisma.User.findMany({
            where: {
                isAdmin: true
            },
            select: {
                id: true,
                email: true
            }
        })

        return users;
    } catch (err) {
        return
    }
}


export async function getUserByIdAction(userId) {
    try {
        const user = await prisma.User.findUnique({
            where: {
                id: userId
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,

                    }
                }
            }
        })

        return user;
    } catch (err) {
        console.log(err);

        return { type: 'error', message: `An error occurred while fetching the user : ${err}` }
    }
}

export async function createUserAction(formData) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email').toLowerCase();
    const contact = formData.get('contact')
    const address = formData.get('address')
    const tenantId = formData.get('tenant')

    const plainPassword = await generateRandomString(12)
    const password = await hashPassword(plainPassword)
    const verificationCode = await generateRandomString(32)
    const passwordResetCode = await generateRandomString(32)

    const tenantInfo = await getTenantAction(tenantId)

    try {
        const existingUser = await prisma.User.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (existingUser) {
            return { type: 'warning', message: `The email is already taken with name : , ${firstName} ${lastName}` }
        }

        const result = await prisma.User.create({
            data: {
                firstName,
                lastName,
                email,
                contact,
                address,
                password,
                verificationCode,
                passwordResetCode,
                tenantId
            }
        });

        sendEmail(result.email, 'New User Creation - Verification Code Email', 'Email Verification Link', newUserEmailTemplate(result, plainPassword, tenantInfo))

        return { type: 'success', message: `Successfully registered the user : ${result.firstName} ${result.lastName}, assigned ID : ${result.id}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the user : ${err}` }
    }
}


export async function editUserAction(formData, id) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email').toLowerCase();
    const contact = formData.get('contact')
    const address = formData.get('address')
    const tenantId = formData.get('tenant')

    try {
        const existingUser = await prisma.User.findUnique({
            where: {
                email: email,
                ...(id && {
                    NOT: {
                        id: id
                    }
                })
            }
        });

        if (existingUser) {
            return { type: 'warning', message: `The email is already taken with name : , ${firstName} ${lastName}` }
        }

        // remove additional tenant which is equals to primary tenant

        const currentUser = await prisma.UserTenant.findUnique({
            where: {
                userId_tenantId: {
                    userId: id,
                    tenantId: tenantId
                }
            }
        })

        if (currentUser) {
            await prisma.UserTenant.delete({
                where: {
                    userId_tenantId: {
                        userId: id,
                        tenantId: tenantId
                    }
                }
            })

        }

        const result = await prisma.User.update({
            where: {
                id
            },
            data: {
                firstName,
                lastName,
                contact,
                address,
                tenantId
            }
        });

        revalidatePath(`/dashboard/user/${id}`)
        return { type: 'success', message: `Successfully updated the user : ${result.firstName} ${result.lastName}, assigned ID : ${result.id}`, id: result.id }
    } catch (err) {
        return { type: 'error', message: `An error occurred while registering the user : ${err}` }
    }

}


export async function enableDisableUser(id) {

    try {
        // Fetch the current tenant to get the current 'active' status
        const user = await prisma.User.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedUser = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                isActive: !user.isActive
            }
        });

        return { type: 'success', message: `Successfully updated status of the user ${user?.firstName}` }

    } catch (err) {
        return { type: 'error', message: "Error updating tenant status:" }
    }
}


export async function enableDisableAdminUser(id) {

    try {
        // Fetch the current tenant to get the current 'active' status
        const user = await prisma.User.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedUser = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                isAdmin: !user.isAdmin
            }
        });

        return { type: 'success', message: `Successfully updated status of the user ${user?.firstName}` }

    } catch (err) {
        return { type: 'error', message: "Error updating tenant status:" }
    }
}


export async function lockUnlockUser(id) {

    try {
        // Fetch the current tenant to get the current 'active' status
        const user = await prisma.User.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedUser = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                isLocked: !user.isLocked,
                loginAttempts: 0
            }
        });

        return { type: 'success', message: `Successfully updated status of the user ${user?.firstName}` }

    } catch (err) {
        return { type: 'error', message: "Error updating tenant status:" }
    }
}

export async function deactivate2faUser(id) {

    try {
        // Fetch the current tenant to get the current 'active' status
        const user = await prisma.User.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        // Toggle the 'active' status
        const updatedUser = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                authenticatorSecret: null,
                isAuthenticatorEnabled: false,
                authenticatorUrl: null
            }
        });

        return { type: 'success', message: `Successfully updated status of the user ${user?.firstName}` }

    } catch (err) {
        return { type: 'error', message: "Error updating tenant status:" }
    }
}


export async function generatePasswordResetCode(id) {
    try {
        const user = await prisma.User.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        const passwordResetCode = await generateRandomString(16)

        const generateCode = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                passwordResetCode: encodeURIComponent(passwordResetCode)
            }
        })

        sendEmail(generateCode.email, 'Password Reset Code', 'Email Password Reset Link', userPasswordResetEmailTemplate(generateCode))

        return { type: 'success', message: `Successfully generated the password reset code and the link has already been send to the user.` }
    } catch (err) {
        return { type: 'error', message: `An error occurred while generating the password reset code. : ${err}` }
    }
}


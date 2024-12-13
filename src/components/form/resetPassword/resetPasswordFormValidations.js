'use server'

import prisma from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/password"

export const validateResetPasswordForm = async (formData, id) => {
    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    // check all fields
    if (!currentPassword) {
        return { type: 'warning', message: `Current password is required.` }
    }

    if (!newPassword) {
        return { type: 'warning', message: `New password is required.` }
    }

    if (!confirmPassword) {
        return { type: 'warning', message: `Confirm password is required.` }
    }

    try {
        // check current password
        const user = await prisma.User.findUnique({
            where: {
                id: id,
            },
            select: {
                password: true
            }
        })

        // check user existance
        if (!user) {
            return { type: 'error', message: `User doesn't exists in the database.` }
        }

        // check current password
        if (!await verifyPassword(currentPassword, user.password)) {
            return { type: 'warning', message: 'Invalid current password, please check and try again.' }
        }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching user from the database. ${err}` }
    }

    // check new password and confirm password
    if (newPassword !== confirmPassword) {
        return { type: 'warning', message: `Confirm password doesn't match with the new password.` }
    }


    try {

        const hashedPassword = await hashPassword(newPassword)

        await prisma.User.update({
            where: {
                id: id
            },
            data: {
                password: hashedPassword,
                isPasswordResetRequired: false
            }
        })

        return { type: 'success', message: 'Successfully updated the user password.', redirectUrl: '/dashboard' }
    } catch (err) {
        return { type: 'error', message: `An error occurred while updating the user password. ${err}` }
    }
}
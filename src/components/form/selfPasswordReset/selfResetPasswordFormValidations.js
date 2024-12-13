'use server'

import prisma from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/password"

export const validateSelfResetPasswordForm = async (formData, id) => {
    const errors = []

    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    // check all fields
    if (!currentPassword) {
        errors.push('Current password is required.')
    }

    if (!newPassword) {
        errors.push(`New password is required.`)
    }

    if (!confirmPassword) {
        errors.push(`Confirm password is required.`)
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
            errors.push(`User doesn't exists in the database.`)
        }

        // check current password
        if (!await verifyPassword(currentPassword, user.password)) {
            errors.push('Invalid current password, please check and try again.')
        }

    } catch (err) {
        errors.push(`An error occurred while fetching user from the database. ${err}`)
    }

    // check new password and confirm password
    if (newPassword !== confirmPassword) {
        errors.push(`Confirm password doesn't match with the new password.`)
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

    } catch (err) {
        errors.push(`An error occurred while updating the user password. ${err}`)
    }

    return errors;
}
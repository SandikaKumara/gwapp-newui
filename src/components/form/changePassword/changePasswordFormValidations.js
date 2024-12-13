'use server'
import prisma from "@/lib/db"
import { hashPassword } from "@/lib/password"

export const changePasswordFormValidations = async (formData) => {
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')
    const code = formData.get('code')

    // check all fields

    if (!code) {
        return { type: 'warning', message: 'Password reset code is required.' }
    }

    if (!newPassword) {
        return { type: 'warning', message: `New password is required.` }
    }

    if (!confirmPassword) {
        return { type: 'warning', message: `Confirm password is required.` }
    }

    // check new password and confirm password
    if (newPassword !== confirmPassword) {
        return { type: 'warning', message: `Confirm password doesn't match with the new password.` }
    }

    try {
        // check current password
        const user = await prisma.User.findFirst({
            where: {
                passwordResetCode: code,
            },
            select: {
                password: true,
                isLocked: true,
                isActive: true,
                id: true
            }
        })

        // check user existance
        if (!user) {
            return { type: 'error', message: `Invalid password reset code or code has expired.` }
        }

        if (user) {
            const hashedPassword = await hashPassword(newPassword)

            await prisma.User.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                    isPasswordResetRequired: false,
                    passwordResetCode: null
                }
            })

        }

        return { type: 'success', message: 'Successfully updated the user password.', redirectUrl: '/dashboard' }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching user from the database. ${err}` }
    }

}

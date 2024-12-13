import { getUserAction } from "@/dbActions/userActions"
import { isValidEmail } from "@/lib/common"


export const validateForgotPasswordForm = async (formData) => {

    const email = formData.get("email")

    if (!email) {
        return { type: 'warning', message: 'Email is required.' }
    }

    if (!await isValidEmail(email)) {
        return { type: 'warning', message: 'Invalid email address.' }
    }

    try {
        const user = await getUserAction(email)
        if (!user) {
            return { type: 'warning', message: `No user found with the email ${email}` }
        }

        if (user.isLocked) {
            return { type: 'warning', message: 'User is locked.' }
        }

        if (!user.isActive) {
            return { type: 'warning', message: 'User is disabled.' }
        }

        return { type: 'success', message: user.id }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching user data from the database. : ${err}` }
    }

}
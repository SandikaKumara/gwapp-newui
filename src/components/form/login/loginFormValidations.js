'use server'
import { createLogAuditEntry } from "@/dbActions/loginAudit";
import { getUserAction } from "@/dbActions/userActions";
import { isValidEmail } from "@/lib/common";
import { verifyPassword } from "@/lib/password";
import { updateLoginAttempt } from "@/lib/sessionActions";

export async function validateLoginForm(formData) {
    const email = formData.get('email').toLowerCase();
    const password = formData.get('password');


    //check email and password existance
    if (!email || !password) {
        return { type: 'warning', message: 'Both email and password required!' }
    }

    // check valid email address
    if (!await isValidEmail(email)) {
        await createLogAuditEntry(null, 'failed', email, 'Provided email address is invalid.')
        return { type: 'warning', message: 'Provided email address is invalid.' }
    }

    // get the user from the database
    try {
        const user = await getUserAction(email)

        // check user existance
        if (!user) {
            await createLogAuditEntry(null, 'failed', email, "User doesn't exists.")
            return { type: 'error', message: `User doesn't exists in the database with email address ${email}.` }
        }

        // check verified user
        if (!user.isActive && user.verificationCode) {
            await createLogAuditEntry(user?.id, 'failed', email, "User is not verified.")
            return { type: 'warning', message: 'User is not verified, please check your email inbox for verification code and the link.' }
        }

        // check disabled user
        if (!user.isActive && user.verificationCode === "") {
            await createLogAuditEntry(user?.id, 'failed', email, "User is disabled.")
            return { type: 'warning', message: 'User is disabled.' }
        }

        // check user is locked 
        if (user.isLocked) {
            await createLogAuditEntry(user?.id, 'failed', email, "User is locked.")
            return { type: 'warning', message: 'User has been locked due to failed login attempts exceeded. Please contact administrator.' }
        }

        // check is password correct
        if (!await verifyPassword(password, user.password)) {
            const result = await updateLoginAttempt(user.id, user.loginAttempts)
            if (result) {
                await createLogAuditEntry(user?.id, 'failed', email, result.message)
                return { type: result.type, message: result.message }
            }
            await createLogAuditEntry(user?.id, 'failed', email, 'Invalid password')
            return { type: 'warning', message: 'Invalid password, please check and try again.' }
        }

        // check required password reset
        if (user.isPasswordResetRequired) {
            await createLogAuditEntry(user?.id, 'failed', email, 'Must reset the default password')
            return { type: 'warning', message: 'You must reset the default password', redirectUrl: `/reset-password/${user.id}` }
        }

        // update login attempts for automatically locking
        const result = await updateLoginAttempt(user.id, -1)
        if (result) {
            await createLogAuditEntry(user?.id, 'failed', email, result.message)
            return { type: result.type, message: result.message }
        }

        // check 2FA enabled
        if (!user?.isAuthenticatorEnabled) {
            await createLogAuditEntry(user?.id, 'failed', email, "Not enabled MFA")
            return { type: 'warning', message: "Please enable multi-factor authentication (MFA).", redirectUrl: `/mfa-authenticate/${user.id}` }
            // return { show2fa: true }
        }

        if (user?.isAuthenticatorEnabled) {
            return { show2fa: true }
        }

        await createLogAuditEntry(user?.id, 'success', email, 'Successfully logged In.')
        return

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching the user from the database. : ${err}` }
    }


}
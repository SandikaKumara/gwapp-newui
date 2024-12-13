'use server'
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { getSession } from './sessionActions';
import prisma from './db';

export const generateQRCode = async (email) => {
    console.log("email123", email);

    const secret = speakeasy.generateSecret({
        name: `UntangleBI: ${email}`,
        length: 20
    });

    // Generate QR code URL
    const otpauth_url = secret.otpauth_url;

    // Generate QR code image URL
    const qrCodeUrl = await QRCode.toDataURL(otpauth_url);

    return { type: 'success', message: 'Successfully generated the authenticator code.', qrCodeUrl: qrCodeUrl, secret: secret.base32 }
}

export const generateToken = async () => {
    try {

        const session = await getSession();

        const user = await prisma.User.findUnique({
            where: {
                id: session?.userId
            }
        })

        if (!user?.isAuthenticatorEnabled) {

            result = generateQRCode(session?.email)

            return result
            // const secret = speakeasy.generateSecret({
            //     name: `UntangleBI: ${session?.email}`,
            //     length: 20
            // });

            // // Generate QR code URL
            // const otpauth_url = secret.otpauth_url;

            // // Generate QR code image URL
            // const qrCodeUrl = await QRCode.toDataURL(otpauth_url);

            // return { type: 'success', message: 'Successfully generated the authenticator code.', qrCodeUrl: qrCodeUrl, secret: secret.base32 }

        } else {
            // update user
            const result = await prisma.User.update({
                where: {
                    id: session?.userId
                },
                data: {
                    authenticatorSecret: null,
                    isAuthenticatorEnabled: false,
                    authenticatorUrl: null,
                }
            })

            return { type: 'success', message: 'Successfully removed the authenticator for 2FA.', qrCodeUrl: null, secret: null }
        }


    } catch (err) {
        return { type: 'error', message: err.message }
    }
}

export const confirmToken = async (formData, userId = null) => {
    try {
        const code = formData.get("code")
        const secret = formData.get("authenticatorSecret")
        const url = formData.get("authenticatorUrl")

        const verify = await verifyToken(code, secret)
        // console.log(verify);

        if (verify.type !== 'success') {
            return { type: 'error', message: 'Incorrect verification code.' }
        }

        let user_id;

        if (userId) {
            user_id = userId
        } else {
            const session = await getSession()
            user_id = session?.userId
        }


        // update user
        const result = await prisma.User.update({
            where: {
                id: user_id
            },
            data: {
                authenticatorSecret: secret,
                isAuthenticatorEnabled: true,
                authenticatorUrl: url
            }
        })

        return { type: 'success', message: 'Successfully enabled 2FA with authenticator app.' }
    } catch (err) {
        return { type: 'error', message: err.message }
    }
}


export const verifyToken = async (token, secret = null, email = null) => {

    try {
        let verified;

        if (secret) {
            verified = speakeasy.totp.verify({
                secret: secret.trim().toUpperCase(),
                encoding: 'base32',
                token: token.trim(),
                window: 1  // Allow for a 30-second clock drift
            })
        }

        if (email) {

            const user = await prisma.User.findUnique({
                where: {
                    email: email.toLowerCase()
                },
                select: {
                    authenticatorSecret: true
                }
            })

            verified = speakeasy.totp.verify({
                secret: user?.authenticatorSecret.trim().toUpperCase(),
                encoding: 'base32',
                token: token.trim(),
                window: 1  // Allow for a 30-second clock drift
            })
        }


        if (verified) {
            return { type: 'success', message: 'Successfully verified.' }
        } else {
            return { type: 'warning', message: 'Verification failed.' }
        }

    } catch (err) {
        return { type: 'error', message: err.message }
    }
}

export const manualToken = async () => {
    const token = speakeasy.totp({
        secret: 'MREVWXKLMYRUIVJSFFQUYUSXLA3DK4J6',
        encoding: 'base32',
        window: 1
    })
    console.log("manual token: ", token);

}
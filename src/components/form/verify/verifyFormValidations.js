'use server'
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function validateVerifyForm(formData) {
    const code = formData.get('code')


    // check code existance
    if (!code) {
        return { type: 'warning', message: 'Verification code should not be blank.' }
    }

    if (code.length !== 32) {
        return { type: 'warning', message: 'Invalid verification code provided. The length of the code should be 32 characters.' }
    }

    try {
        const user = await prisma.User.findFirst({
            where: {
                verificationCode: code
            },
            select: {
                id: true,
            }
        })

        if (!user) {
            return { type: 'warning', message: `No matching verification code was found in the database. Please ensure you have entered the correct code or request a new one.` }
        }

        await prisma.User.update({
            where: {
                id: user.id
            },
            data: {
                isActive: true,
                verificationCode: ""
            }
        })

        return { type: 'success', message: 'Your account has been successfully activated. You can now log in and start using the application.', redirectUrl: '/login' }

    } catch (err) {
        return { type: 'error', message: `An error occurred while fetching user data from the database. : ${err}` }
    }

}
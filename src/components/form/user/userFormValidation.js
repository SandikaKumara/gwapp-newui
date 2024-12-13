'use server'

import prisma from "@/lib/db"

const validateUserForm = async (formData, id) => {

    const errors = []

    if (!formData.get("firstName")) errors.push("First Name is required.")
    if (!formData.get('email')) errors.push("Email is required.")

    const existUser = await prisma.User.findUnique({
        where: {
            email: formData.get('email'),
            ...(id && {
                NOT: {
                    id: id
                }
            })
        }
    })

    if (existUser) errors.push("This email address is already registered. Please use a different one.")

    return errors;
}

export default validateUserForm;
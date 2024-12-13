'use server'

import prisma from "@/lib/db"

const validateMenuFrom = async (formData, id) => {
    const errors = []

    if (!formData.get('name')) errors.push("Name is required.")
    // if (!formData.get('category')) errors.push('Category is required.')
    if (!formData.get('tenant')) errors.push('Tenant is required.')

    try {
        const existMenu = await prisma.Menu.findUnique({
            where: {
                name_tenantId_category: {
                    name: formData.get('name'),
                    tenantId: formData.get('tenant'),
                    category: formData.get('category')
                },
                ...(id && {
                    NOT: {
                        id: id
                    }
                })
            }
        })

        if (existMenu) errors.push('Name should be unique.')
    } catch (err) {
        return `Error while fetching menu data from the database : ${err}`
    }

    return errors;
}

export default validateMenuFrom;
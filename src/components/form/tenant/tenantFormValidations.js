'use server'
import prisma from "@/lib/db"

export const validateTenantForm = async (formData, id) => {

    const errors = []

    if (!formData.get('name')) errors.push("Name is required.")
    if (!formData.get('logoPath').name) errors.push("Logo Image is required.")

    // check existance of the tenant
    const existTenant = await prisma.Tenant.findUnique({
        where: {
            name: formData.get('name'),
            ...(id && {
                NOT: {
                    id: id
                }
            })
        }
    })

    if (existTenant) errors.push("Name should be unique.")

    return errors;
}


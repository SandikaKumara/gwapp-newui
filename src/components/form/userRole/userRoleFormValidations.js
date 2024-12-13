'use server'

import prisma from "@/lib/db"

const validateUserRoleForm = async (formData, id) => {

    const errors = []

    if (!formData.get('name')) errors.push("Name is required.")
    if (!formData.get('tenant')) errors.push('Tenant is required.')

    const existUserRole = await prisma.UserRole.findUnique({
        where: {
            name_tenantId: {
                name: formData.get('name'),
                tenantId: formData.get('tenant'),
            },
            ...(id && {
                NOT: {
                    id: id
                }
            })
        }
    })
    // console.log("here: ", existUserRole);

    if (existUserRole) errors.push('Name should be unique.')

    return errors;
}

export default validateUserRoleForm;
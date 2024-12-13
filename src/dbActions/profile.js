'use server'

import prisma from "@/lib/db";
import { fileUpload, uploadFileNew } from "@/lib/files";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData, id = "0") {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const contact = formData.get('contact')
    const address = formData.get('address')
    const imagePath = formData.get('imagePath')
    const file = formData.get("profileImage");

    let logoPath;
    let newFileName;

    if (file && file.name && file.name !== 'undefined') {
        newFileName = id + '_' + file.name;
        logoPath = '/img/' + newFileName;
    }

    try {
        if (id === "0") {
            // insert new

        } else {
            // replace existsing
            const updateData = {
                firstName,
                lastName,
                contact,
                address,
                ...(logoPath && { logoPath }) // Only include logoPath if it's defined
            };

            await prisma.User.update({
                where: {
                    id
                },
                data: updateData
            });
        }
        if (logoPath) {
            const fileUploadRes = await uploadFileNew(file, newFileName, "img")
            if (fileUploadRes.type !== 'success') {
                throw new Error(fileUploadRes.message)
            }
        }

        revalidatePath(`/dashboard/profile/${id}`)
        return { type: 'success', message: `Successfully updated the user.` }
    } catch (err) {
        console.log(err);
        return { type: 'error', message: `An error occurred while modifying the user : ${err}` }
    }

}



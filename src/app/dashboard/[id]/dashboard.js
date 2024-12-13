'use server'
import prisma from "@/lib/db"

export const fetchMenuUrl = async (id) => {
    try {
        const url = await prisma.Menu.findUnique({
            where: {
                id: id
            },
            select: {
                url: true
            }
        })

        return url && { type: 'success', message: url }
    } catch (err) {
        const errorMessage = `An error occurred while fetching menu URL. : ${err}`
        console.log(errorMessage);
        return { type: 'error', message: errorMessage }
    }
}


import { hashPassword } from '../src/lib/password.js';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {

    const hashedPassword = await hashPassword("gw123#")

    const admin = await prisma.User.create({
        data: {
            firstName: 'Admin',
            email: 'sandikan@gatewayict.com.au',
            password: hashedPassword,
            isActive: true,
            isAdmin: true,
            isPasswordResetRequired: false,
            tenant: {
                create: {
                    name: "GatewayICT",
                    address: "Australia",
                    bgColor: "#000000",
                    textColor: "#ffffff",
                    textHoverColor: "#ff0000",
                    borderColor: "#000010",
                    categoryTextColor: "#ffffff",
                }
            }
        }
    })
    console.log(admin);

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
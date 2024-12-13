import prisma from "./db";

export async function getMenusForUserAndTenant(userId, tenantId) {
    try {
        // Verify if the user belongs to the tenant
        const user = await prisma.User.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        const userTenant = await prisma.userTenant.findFirst({
            where: {
                userId: userId,
                tenantId: tenantId,
            },
            select: {
                id: true
            }
        });


        if (!userTenant && !user) {
            throw new Error("User does not belong to the specified tenant.");
        }

        // Fetch all user roles for the user in the given tenant
        const userRoles = await prisma.userUserRole.findMany({
            where: {
                userId: userId,
                userRole: {
                    tenantId: tenantId,
                },
            },
            include: {
                userRole: true,
            },
        });

        const userRoleIds = userRoles.map((userRole) => userRole.userRoleId);

        // Fetch all menus associated with the user's roles and tenant
        const menus = await prisma.userRoleMenu.findMany({
            where: {
                userRoleId: {
                    in: userRoleIds, // Match user role IDs
                },
                menu: {
                    tenantId: tenantId, // Match the tenant
                    isActive: true
                },
            },
            include: {
                menu: true,
            },
            orderBy: {
                menu: {
                    order: 'asc'
                }
            }
        });

        const menuList = menus.map((userRoleMenu) => ({
            id: userRoleMenu.menu.id,
            name: userRoleMenu.menu.name,
            category: userRoleMenu.menu.category
        }));
        return { type: 'success', message: menuList }

    } catch (err) {
        console.log(`An error occurred while fetching user menu. : ${err}`);
        return { type: 'error', message: `An error occurred while fetching user menu. : ${err}` }
    }
}
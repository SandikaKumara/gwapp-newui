"use server"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { sessionOptions } from "@/lib/sessionLib"
import prisma from "./db"
import { defaultSessionTenant } from "./defaults"
import { getTenantAction } from "@/dbActions/tenant"
import { getMenusForUserAndTenant } from "./userMenu"
import { createLogAuditEntry } from "@/dbActions/loginAudit"



export const getSession = async () => {
    const session = await getIronSession(cookies(), sessionOptions)
    return session;
}

export const login = async (email) => {
    try {
        const session = await getSession()

        const user = await prisma.User.findUnique({
            where: {
                email: email.toLowerCase()
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        bgColor: true,
                        textColor: true,
                        textHoverColor: true,
                        borderColor: true,
                        categoryTextColor: true,
                        homeUrl: true,
                        mobileUrl: true,
                        logoPath: true
                    }
                }
            }
        })

        if (user) {
            session.userId = user.id
            session.email = user.email
            session.firstName = user.firstName
            session.lastName = user.lastName
            session.isAdmin = user.isAdmin
            session.userImage = user.logoPath
            session.tenantId = user.tenant.id
            session.tenantName = user.tenant.name
            session.homeUrl = user.tenant.homeUrl
            session.mobileUrl = user.tenant.mobileUrl
            session.logoPath = user.tenant.logoPath
            session.bgColor = user.tenant.bgColor
            session.textColor = user.tenant.textColor
            session.textHoverColor = user.tenant.textHoverColor
            session.borderColor = user.tenant.borderColor
            session.categoryTextColor = user.tenant.categoryTextColor

            // fetching user menu
            const menus = await addUserMenus(user.id, user.tenant.id)

            if (menus) {
                session.menus = menus
            }
        }

        await session.save()
        await createLogAuditEntry(user?.id, 'success', user?.email, "Successfully Logged In")

        // console.log(session);

    } catch (err) {
        console.log(err);
        return { type: 'error', message: `Error while creating the user session.: ${err}` }
    }
}

export const updateLoginAttempt = async (id, attempts) => {
    try {

        const locked = (attempts + 1) >= 5 ? true : false

        await prisma.User.update({
            where: {
                id: id
            },
            data: {
                loginAttempts: attempts + 1,
                isLocked: locked
            }
        })

        return
    } catch (err) {
        console.log(err);
        return { type: 'error', message: `An error occurred while updating database. : ${err}` }

    }
}

export const logOut = async () => {
    try {
        const session = await getSession()
        session.destroy()
        return { type: 'success', message: 'Successfully logged out.', redirectUrl: '/login' }
    } catch (err) {
        return { type: 'error', message: `An error occurred while logging out the session. : ${err}` }
    }
}

export const getSessionTenant = async () => {
    try {

        const session = await getSession();

        if (session) {
            const sessionTenant = {
                userId: session.userId,
                email: session.email,
                firstName: session.firstName,
                lastName: session.lastName,
                isAdmin: session.isAdmin,
                userImage: session.userImage,
                homeUrl: session.homeUrl,
                mobileUrl: session.mobileUrl,
                logoPath: session.logoPath,
                tenantName: session.tenantName,
                menus: session.menus,
                bgColor: session.bgColor,
                textColor: session.textColor,
                textHoverColor: session.textHoverColor,
                borderColor: session.borderColor,
                categoryTextColor: session.categoryTextColor
            }

            return sessionTenant
        }

        return defaultSessionTenant
    } catch (err) {
        console.log(`An error occurred while fetching session tenant data : ${err}`);
        return defaultSessionTenant
    }
}


export const updateSessionTenant = async (tenantId) => {
    try {
        const session = await getSession()
        if (session) {
            // fetch data from tenant
            const tenant = await getTenantAction(tenantId)

            if (!tenant) {
                return { type: 'error', message: 'Tenant cannot find in the database.' }
            }
            session.tenantId = tenant.id
            session.tenantName = tenant.name
            session.homeUrl = tenant.homeUrl
            session.mobileUrl = tenant.mobileUrl
            session.logoPath = tenant.logoPath
            session.bgColor = tenant.bgColor
            session.textColor = tenant.textColor
            session.textHoverColor = tenant.textHoverColor
            session.borderColor = tenant.borderColor
            session.categoryTextColor = tenant.categoryTextColor

            // fetching user menu
            const menus = await addUserMenus(session.userId, tenant.id)

            if (menus) {
                session.menus = menus
            }
            await session.save()

            return { type: 'success', message: 'Successfully switched to the selected tenant' }
        }
    } catch (err) {
        return { type: 'error', message: `An error occurred while switching the tenant. : ${err}` }
    }
}

const addUserMenus = async (userId, tenantId) => {
    try {
        const menus = await getMenusForUserAndTenant(userId, tenantId)
        // console.log("menus : ", menus);

        if (menus.type === 'success') {
            return menus.message
        }
    } catch (err) {
        return
    }
}

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export async function createUser(req) {
    const user = {
        email:  req.userInfo.email,
    }
    try {
        const createUser = await prisma.users.create({ data: user })
        return [createUser, null]
    }
    catch(err) {
        return [null, err]
    }
}

export async function getUserByEmail(email) {
    try {
        const user = await prisma.users.findUnique({
            where: {
                email:  email,
            }
        })
        return [user, null]
    }
    catch(err) {
        return [null, err]
    }
}

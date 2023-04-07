import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export async function createUser(req) {
    const user = {
        name:   req.userInfo.name,
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

export async function getUserByWalletAddress(walletAddress) {
    try {
        const user = await prisma.users.findFirst({
            where: {
                wallet_address:  walletAddress,
            }
        })
        return [user, null]
    }
    catch(err) {
        return [null, err]
    }
}


export async function addWallet(req) {
    try {
        const user = await prisma.users.update({
            where: {
                email:  req.userInfo.email,
            },
            data : {
                wallet_address:  req.body.walletAddress,
            }
        })
        return [user, null]
    }
    catch(err) {
        return [null, err]
    }
}
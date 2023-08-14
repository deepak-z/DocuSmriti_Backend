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

export async function getAllUserInfo(start_date, end_date) {
    try {
      const userDetails = await prisma.users.findMany({
        where: {
          created_at: {
            gte: start_date,
            lte: end_date,
          },
        },
      });
      return [userDetails, null];
    } catch (err) {
      return [null, err];
    }
  }

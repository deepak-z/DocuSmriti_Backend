import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

export const api_cost = {
  AADHAAR: 2.5,
  SELFIE: 1,
};

export const vendor = {
  ZOOP: 1,
  RAZORPAY: 2,
};


export async function getZoopApiHits(start_date, end_date) {
    try {
      const zoopApiHits = await prisma.vendor_call_trackings.findMany({
        where: {
          created_at: {
            gte: start_date,
            lte: end_date,
          },
          vendor_id: vendor.ZOOP,
        },
      });
      return [zoopApiHits, null];
    } catch (err) {
      return [null, err];
    }
}
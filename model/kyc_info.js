import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const kyc_info = {
  NOT_VERIFIED: "not_verified",
  INITIATED: "initiated",
  IN_PROGRESS: "in_progress",
  VERIFIED: "verified",
  REJECTED: "rejected"
};

export async function saveUserKycInfoObject(kycInfoObject) {
  try {
    const [savedKycInfo, updatedUser] = await prisma.$transaction([
      prisma.kyc_info.create({ data: kycInfoObject }),
      prisma.users.update({
        where: { id: kycInfoObject.user_id },
        data: { kyc_status: kycInfoObject.status },
      }),
    ]);
    return [savedKycInfo, null];
  } catch (err) {
    if (err.code == "P2002") {
      return ["User Kyc Info already stored in DB", err];
    }
    return [null, err];
  }
}

export async function getUserKycInfoByID(id) {
  try {
    const kycInfo = await prisma.kyc_info.findUnique({
      where: { user_id: id },
    });
    return [kycInfo, null];
  } catch (err) {
    return [null, err];
  }
}

export async function updateUserKycInfoById(id, object) {
  try {
    await prisma.kyc_info.update({
      where: { user_id: id },
      data: object,
    });
    return null;
  } catch (err) {
    return err;
  }
}

export async function updateUserKycStatus(id, status) {
  try {
    await prisma.$transaction([
      prisma.kyc_info.update({
        where: { user_id: id },
        data: { status: status },
      }),
      prisma.users.update({
        where: { id: id },
        data: { kyc_status: status },
      }),
    ]);
    return null;
  } catch (err) {
    return err;
  }
}

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export async function saveUserKycInfo(req) {
  const kycInfoObject = {
    user_id: req.user.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dob: req.body.dob,
    status: "pending", // TODO Need Hyperverge implementation for setting status
    gender: req.body.gender,
    aadhaar_number: req.body.aadhaar_number, //TODO Need to follow masking principles
  }
  try {
    const [savedKycInfo, updatedUser] = await prisma.$transaction([
      prisma.kyc_info.create({ data: kycInfoObject }),
      prisma.users.update({
        where: {
          id: req.user.id,
        },
          data: {
            kyc_status: kycInfoObject.status,
          },
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

export async function getUserKycInfo(req) {
  try {
    const kycInfo = await prisma.kyc_info.findUnique({
      where: {
        user_id: req.user.id,
      },
    });

    return [kycInfo, null];
  } catch (err) {
    return [null, err];
  }
}

export async function updateUserKycInfo(req) {
  try {
    await prisma.kyc_info.update({
      where: {
        user_id: req.user.id,
      },
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob,
        gender: req.body.gender,
        aadhaar_number: req.body.aadhaar_number,
      }
    });
    return null;
  } catch (err) {
      return err
  }
}

export async function verifyKycAndUser(user_id) {
  try {
    const [savedKycInfo, updatedUser] = await prisma.$transaction([
      prisma.kyc_info.create({ data: kycInfoObject }),
      prisma.kyc_info.update({
        where: {
          id: user_id,
        },
          data: {
            kyc_status: "verified",
          },
        }),
      prisma.users.update({
        where: {
          id: user_id,
        },
          data: {
            kyc_status: "verified",
          },
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
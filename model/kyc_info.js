import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export async function saveUserKycInfo(req) {
  const isValidRequest = validateRequest(req);
  if (isValidRequest) {
    const kycInfoObject = {
      user_id: req.user.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      dob: req.body.dob,
      status: "verified", // TODO Need Hyperverge implementation for setting status
      gender: req.body.gender,
      aadhaar_number: req.body.aadhaar_number, //TODO Need to follow masking principles
    };
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
  } else {
    return ["parameters cannot be empty", "INVALID_REQUEST"];
  }
}

export async function getUserKycInfo(req) {
  try {
    const kycInfo = await prisma.kyc_info.findUnique({
      where: {
        user_id: req.user.id,
      },
    });

    if (kycInfo == null) {
      return ["no kyc info exists for user", null];
    }
    return [kycInfo, null];
  } catch (err) {
    return [null, err];
  }
}

function validateRequest(req) {
  // TODO: need to add conditions for aadhaar_front_path, aadhaar_back_path and selfie_path
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.gender ||
    !req.body.dob ||
    !req.body.aadhaar_number
  ) {
    console.log(req.body);
    return false;
  }
  return true;
}

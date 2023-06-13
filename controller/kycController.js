import { getUserKycInfo, saveUserKycInfo, verifyUserKycInfo } from "../helper/kycHelper.js";
import { sendResponse } from "../utility/response.js";

export async function GetUserKycInfo(req, res, next) {
  const [response, err] = await getUserKycInfo(req);
  sendResponse(res, response, err);
}

export async function SaveUserKycInfo(req, res, next) {
  const [response, err] = await saveUserKycInfo(req);
  sendResponse(res, response, err);
}

export async function VerifyUserKycInfo(req, res, next) {
  const [response, err] = await verifyUserKycInfo(req);
  sendResponse(res, response, err);
}


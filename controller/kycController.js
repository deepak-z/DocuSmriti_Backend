import { getUserKycInfo, saveUserKycInfo, verifyUserKycInfo, verifyUserSelfie, getKycStatistics} from "../helper/kycHelper.js";
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

export async function VerifyUserSelfie(req, res, next) {
  const [response, err] = await verifyUserSelfie(req);
  sendResponse(res, response, err);
}

export async function GetKycStatistics(req, res, next) {
  const [response, err] = await getKycStatistics(req);
  sendResponse(res, response, err);
}
import { sendResponse } from "../utility/response.js";
import { userLogIn } from "../helper/userHelper.js";
import { getUserKycInfo } from "../model/kyc_info.js";
import { saveKycInfo } from "../helper/kycHelper.js";

export async function LogIn(req, res, next) {
  const [response, err] = await userLogIn(req);
  sendResponse(res, response, err);
}

export async function GetKycInfo(req, res, next) {
  const [response, err] = await getUserKycInfo(req);
  sendResponse(res, response, err);
}

export async function SaveUserKycInfo(req, res, next) {
  const [response, err] = await saveKycInfo(req);
  sendResponse(res, response, err);
}
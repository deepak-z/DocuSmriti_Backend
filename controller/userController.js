import { sendResponse } from "../utility/response.js";
import { userLogIn, getKycStatistics, getUserStatistics } from "../helper/userHelper.js";
import { saveUserKycInfo, getUserKycInfo } from "../model/kyc_info.js";

export async function LogIn(req, res, next) {
  const [response, err] = await userLogIn(req);
  sendResponse(res, response, err);
}

export async function SaveKycInfo(req, res, next) {
  const [response, err] = await saveUserKycInfo(req);
  sendResponse(res, response, err);
}

export async function GetKycInfo(req, res, next) {
  const [response, err] = await getUserKycInfo(req);
  sendResponse(res, response, err);
}

export async function GetKycStatistics(req, res, next) {
  const [response, err] = await getKycStatistics(req);
  sendResponse(res, response, err);
}

export async function GetUserStatistics(req, res, next) {
  const [response, err] = await getUserStatistics(req);
  sendResponse(res, response, err);
}
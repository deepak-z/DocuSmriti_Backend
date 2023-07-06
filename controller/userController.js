import { sendResponse } from "../utility/response.js";
import { userLogIn, getUserStatistics } from "../helper/userHelper.js";

export async function LogIn(req, res, next) {
  const [response, err] = await userLogIn(req);
  sendResponse(res, response, err);
}

export async function GetUserStatistics(req, res, next) {
  const [response, err] = await getUserStatistics(req);
  sendResponse(res, response, err);
}

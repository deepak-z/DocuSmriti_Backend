import { sendResponse } from "../utility/response.js";
import { userLogIn } from "../helper/userHelper.js";

export async function LogIn(req, res, next) {
  const [response, err] = await userLogIn(req);
  sendResponse(res, response, err);
}

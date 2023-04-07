import { sendResponse } from "../utility/response.js";
import { userLogIn, linkUserWallet } from "../helper/userHelper.js";

export async function logIn(req, res, next) {
    const [response, err] = await userLogIn(req)
    sendResponse(res, response, err)
}

export async function linkWallet(req, res, next) {
    const [response, err] = await linkUserWallet(req)
    sendResponse(res, response, err)
}
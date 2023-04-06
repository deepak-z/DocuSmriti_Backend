import { triggerEmail } from "../helper/emailHelper.js"
import { sendResponse } from "../utility/response.js";

export async function sendEmail(req, res, next) {
    var [response, err] = await triggerEmail(req)
    sendResponse(res, {'message': response}, err)
}
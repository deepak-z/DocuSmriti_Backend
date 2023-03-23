import { triggerEmail } from "../helper/emailHelper.js"

export async function sendEmail(req, res, next) {
    var response = await triggerEmail(req)
    res.status(200).json({'message': response})
}
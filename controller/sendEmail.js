import { triggerEmail } from "../helper/sendEmailHelper.js"

export async function sendEmail(req, res, next) {
    var response = await triggerEmail(req)
    res.status(200).json({'message': response})
}
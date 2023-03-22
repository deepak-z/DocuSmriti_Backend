import config from "../config/config.js";
import { createTransport } from "nodemailer";

var transporter = createTransport({
    service: config.email.service,
    auth: {
        user: config.email.from,
        pass: config.email.password,
    },
})

export async function triggerEmail(req){
    var mailOptions = {
        from: config.email.from,
        to: req.body.receiverEmail,
        subject: req.body.subject,
        html: { path: './email/signatureInvitation.html' },
        text: "BasicText",
    }
    var response = "Email sent successfully"
    try {
        await transporter.sendMail(mailOptions)
    } catch(err) {
        response = "Email not sent"
    }
    return response
}
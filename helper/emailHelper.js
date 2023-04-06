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
    if (req.body.receiverEmail == null) {
        return ["Email not sent", "Receiver email cam't be empty"]
    }
    if (req.body.subject == null) {
        return ["Email not sent", "Subject cam't be empty"]
    }
    var mailOptions = {
        from: config.email.from,
        to: req.body.receiverEmail,
        subject: req.body.subject,
        html: { path: './email/signatureInvitation.html' },
        text: "BasicText",
    }

    try {
        await transporter.sendMail(mailOptions)
        return ["Email sent successfully", null]
    } catch(err) {
        console.log(err);
        return ["Email not sent", err]
    }
}
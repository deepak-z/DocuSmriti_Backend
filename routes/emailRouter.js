import { Router } from "express"
const router = Router()

import { sendEmail as _sendEmail } from "../controller/sendEmail.js"

router.post("/send", _sendEmail)

export default router;

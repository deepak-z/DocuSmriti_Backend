import { Router } from "express"
const router = Router()

import { sendEmail as _sendEmail } from "../controller/emailController.js"

router.post("/send", _sendEmail)

export default router;

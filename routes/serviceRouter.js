import { Router } from "express"
const router = Router()

import { logIn } from "../controller/userController.js"
import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"

router.get("/", (req, res) => {
    res.status(200).send("Welcome to DocuSmriti Backend")
})

router.post("/logIn", verifyGoogleToken, logIn)

export default router
import { Router } from "express"
const router = Router()

import { LogIn } from "../controller/userController.js"
import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"
import { AddContract } from "../controller/contractController.js"

router.get("/", (req, res) => {
    res.status(200).send("Welcome to DocuSmriti Backend")
})

router.post("/logIn", verifyGoogleToken, LogIn)

router.post("/addContract", verifyGoogleToken, verifyUser(true, false), AddContract)

export default router
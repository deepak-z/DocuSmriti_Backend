import { Router } from "express"
const router = Router()

import { LogIn } from "../controller/userController.js"
import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"
import { AddContract, EstimateGasPrice } from "../controller/contractController.js"

router.get("/", (req, res) => {
    res.status(200).send("Welcome to DocuSmriti Backend")
})

router.post("/logIn", verifyGoogleToken, LogIn)

router.post("/addContract", verifyGoogleToken, verifyUser(true, false), AddContract)
router.get("/getQuote", verifyGoogleToken, verifyUser(true, false), EstimateGasPrice)

export default router
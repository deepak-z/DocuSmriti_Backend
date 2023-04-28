import { Router } from "express"
const router = Router()

import { LogIn, SaveKycInfo, GetKycInfo } from "../controller/userController.js"
import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"
import { AddContract, EstimateGasPrice } from "../controller/contractController.js"

router.get("/", (req, res) => {
    res.status(200).json({'message' : "Welcome to DocuSmriti Backend. Up and Running"})
})

router.post("/logIn", verifyGoogleToken, LogIn)

router.post("/addContract", verifyGoogleToken, verifyUser(true, false), AddContract)
router.get("/getQuote", verifyGoogleToken, verifyUser(true, false), EstimateGasPrice)

router.post("/kyc",verifyGoogleToken,verifyUser(true,false), SaveKycInfo)
router.get("/kyc",verifyGoogleToken,verifyUser(true,true), GetKycInfo)

export default router
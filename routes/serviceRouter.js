import { Router } from "express"
const router = Router()

import { LogIn, SaveKycInfo, SaveUserKycInfo, GetKycInfo } from "../controller/userController.js"
import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"
import { AddContract, ApproveTransaction } from "../controller/contractController.js"
import { EstimateAcceptContractGasPrice, EstimateAddContractGasPrice } from "../controller/contractController.js"

router.get("/", (req, res) => {
    res.status(200).json({'message' : "Welcome to DocuSmriti Backend. Up and Running"})
})

router.post("/logIn", verifyGoogleToken, LogIn)

router.post("/addContract", verifyGoogleToken, verifyUser(true, true), AddContract)
router.get("/addContract/getQuote", verifyGoogleToken, verifyUser(true, true), EstimateAddContractGasPrice)
router.post("/acceptContract", verifyGoogleToken, verifyUser(true, true), ApproveTransaction)
router.get("/acceptContract/getQuote", verifyGoogleToken, verifyUser(true, true), EstimateAcceptContractGasPrice)


router.post("/kyc",verifyGoogleToken,verifyUser(true,false), SaveKycInfo)
router.get("/kyc",verifyGoogleToken,verifyUser(true,true), GetKycInfo)
router.post("/userInfo", verifyGoogleToken, verifyUser(true, false), SaveUserKycInfo)

export default router
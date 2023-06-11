import { Router } from "express"
const router = Router()

import { verifyGoogleToken, verifyUser } from "../utility/middleware.js"

import { LogIn, SaveUserKycInfo, GetKycInfo } from "../controller/userController.js"
import { AddContract, ApproveTransaction, EstimateAcceptContractGasPrice, EstimateAddContractGasPrice } from "../controller/contractController.js"
import { sendEmail } from "../controller/emailController.js"

// Service Routes
router.get("/", (req, res) => {
    res.status(200).json({'message' : "Welcome to DocuSmriti Backend. Up and Running"})
})

// Email Routes
router.post("/mail",verifyGoogleToken,verifyUser(true,true), sendEmail)

// User Routes
router.post("/logIn", verifyGoogleToken, LogIn)

// Kyc Routes
router.get("/kyc",verifyGoogleToken,verifyUser(true,true), GetKycInfo)
router.post("/kyc", verifyGoogleToken, verifyUser(true, false), SaveUserKycInfo)
router.post("selfie", verifyGoogleToken, verifyUser(true, false), SaveUserKycInfo)

// Contract Routes
router.post("/addContract", verifyGoogleToken, verifyUser(true, true), AddContract)
router.get("/addContract/getQuote", verifyGoogleToken, verifyUser(true, true), EstimateAddContractGasPrice)
router.post("/acceptContract", verifyGoogleToken, verifyUser(true, true), ApproveTransaction)
router.get("/acceptContract/getQuote", verifyGoogleToken, verifyUser(true, true), EstimateAcceptContractGasPrice)

export default router
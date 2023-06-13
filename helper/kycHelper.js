
import { externalApiCall } from "../utility/externalApiCall.js";
import constant from "../constants/constant.js";
import { saveUserKycInfo, getUserKycInfo, updateUserKycInfo, updateKycStatus } from "../model/kyc_info.js";
import config from "../config/config.js";

export async function saveKycInfo(req) {
    const user = req.user
    if(user.kyc_status == "verified"){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }
    const isvalid = validateRequest(req)
    if(!isvalid){ 
        return ["Invalid or empty parameters provided", "INVALID REQUEST"]
    }
    const [kycInfo, err] = await getUserKycInfo(req)
    if(err != null){
        return ["unable to get user kyc data", err]
    }
    if(kycInfo == null){
        const [_data, err] = await saveUserKycInfo(req)
        if (err != null) {
            return ["unable to save in database", err]
        }
    } else {
        const err = await updateUserKycInfo(req)
        if (err != null) {
            return ["unable to update in database", err]
        }
    }

    const url = constant.ZOOP_ONE_OTP_API
    let headers = new Map()
    headers.set("app-id", config.zoop.apiId)
    headers.set("api-key", config.zoop.apiKey)
    const body = {
        "data": {
            "customer_aadhaar_number": `${req.body.aadhaar_number}`,
            "consent": "Y",
            "consent_text": constant.ZOOP_CONSENT_TEXT,
        },
    }
    const [status, response, er] = await externalApiCall('post', url, body, headers)
    if(er != null){
        return ["unable to send OTP", err]
    }
    if(status == 200 && response["result"]["is_otp_sent"]){
        return  ["otp sent succesfully", null]
    }
    return ["unable to send OTP", response["metadata"]["reason_message"]];
}

function validateRequest(req) {
    if(!req.body.first_name  ||  !req.body.last_name  ||  !req.body.dob  ||   !req.body.gender  || !req.body.aadhaar_number ) {
        return false
    }
    return true
}


export async function validateSelfie(req) {
    const user = req.user
    if(user.kyc_status == "verified"){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }
    if(user.kyc_status != "in_progress"){ 
        return ["Aadhaar is not verified", "UNVERIFIED REQUEST"]
    }

    const [kycInfo, err] = await getUserKycInfo(req)
    if(err != null){
        return ["unable to get user kyc data", err]
    }
    if(kycInfo == null){
        return ["user kyc data not found", "KYC NOT INITIATED"]
    }

    const url = constant.ZOOP_ONE_SELFIE_API
    let headers = new Map()
    headers.set("app-id", config.zoop.apiId)
    headers.set("api-key", config.zoop.apiKey)
    const body = {
        "mode": "sync",
        "data": {
          "card_image": constant.AADHAAR_SELFIE,
          "user_image": constant.USER_SELFIE,
          "consent": "Y",
          "consent_text": constant.ZOOP_CONSENT_TEXT
        },
    }
    const [status, response, er] = await externalApiCall('post', url, body, headers)
    if(er != null){
        return ["unable to verify selfie", err]
    }
    
    if(status == 200){
        if (response["result"]["face_match_score"] > constant.SELFIE_THRESOLD) {
            const err = updateKycStatus(req.user.id, "verified")
            if(err != null){
                return ["unable to update selfie status", err]
            }
            return ["Kyc verified successfully", null]
        } else {
            const err = updateKycStatus(req.user.id, "rejected")
            return ["selfie does not match", "INVALID_SELFIE"]
        }
    }
    return ["unable to send OTP", response["metadata"]["reason_message"]];
}
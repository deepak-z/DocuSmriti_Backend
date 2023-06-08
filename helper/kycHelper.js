
import { externalApiCall } from "../utility/externalApiCall.js";
import constant from "../constants/constant.js";
import { saveUserKycInfo, getUserKycInfo, updateUserKycInfo } from "../model/kyc_info.js";
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
    headers.set("app-id", config.zoop.api_id)
    headers.set("api-key", config.zoop.api_key)
    const body = {
        "data": {
            "customer_aadhaar_number": "240477347931",
            "consent": "Y",
            "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API",
        },
    }
    const [status, response, er] = await externalApiCall('post', url, body, headers)
    if(er != null){
        return ["unable to send OTP", err]
    }
    if(status == 200 && response["result"]["is_otp_sent"]){
        return  ["otp sent succesfully", null]
    }
    return ["unable to send OTP", "OTP SENT FAILED"];
}

function validateRequest(req) {
    if(!req.body.first_name  ||  !req.body.last_name  ||  !req.body.dob  ||   !req.body.gender  || !req.body.aadhaar_number ) {
        return false
    }
    return true
}
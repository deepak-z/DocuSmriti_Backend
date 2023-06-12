import { externalApiCall } from "../utility/externalApiCall.js";
import { maskAadhaarNumber } from "../utility/utility.js"
import constant from "../constants/constant.js";
import { kyc_info } from "../model/kyc_info.js";
import { saveUserKycInfoObject, getUserKycInfoByID, updateUserKycInfoById } from "../model/kyc_info.js";
import config from "../config/config.js";

export async function getUserKycInfo(req){
    const user = req.user
    const [kycInfo,err] = await getUserKycInfoByID(user.id)
    return [kycInfo,err]
}

export async function saveUserKycInfo(req) {
    if(!req.body.first_name  ||  !req.body.last_name  ||  !req.body.dob  ||   !req.body.gender  || !req.body.aadhaar_number ) {
        return ["Invalid or empty parameters provided", "INVALID REQUEST"]
    }

    const user = req.user
    if(user.kyc_status == kyc_info.VERIFIED){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }

    const [kycInfo, err] = await getUserKycInfoByID(user.id)
    if(err != null){
        return ["Unable to get user kyc info", err]
    }

    const [maskedAaadhaarNumber,maskError] = await maskAadhaarNumber(req.body.aadhaar_number)
    if (maskError != null){
        return ["Could not mask aadhaar",maskError]
    }
    const userKycInfoObject = {
        user_id: user.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        dob: req.body.dob,
        gender: req.body.gender,
        aadhaar_number: maskedAaadhaarNumber,
        status: kyc_info.PENDING,
    };

    if(kycInfo == null){
        const [data, err] = await saveUserKycInfoObject(userKycInfoObject)
        if (err != null) {
            return ["Unable to save user kyc info in database", err]
        }
    } else {
        const err = await updateUserKycInfoById(user.id,userKycInfoObject)
        if (err != null) {
            return ["Unable to update user kyc info in database", err]
        }
    }

    const url = constant.ZOOP_ONE_OKYC_OTP_REQUEST_API
    let headers = new Map()
    headers.set("app-id", config.zoop.apiId)
    headers.set("api-key", config.zoop.apiKey)
    const body = {
        "data": {
            "customer_aadhaar_number": `${req.body.aadhaar_number}`,
            "consent": constant.ZOOP_ONE_CONSENT,
            "consent_text": constant.ZOOP_ONE_CONSENT_TEXT,
        },
    }
    const [status, response, zoopErr] = await externalApiCall('post', url, body, headers)
    if(zoopErr != null){
        return ["unable to send OTP", zoopErr]
    }
    if(status == 200 && response["result"]["is_otp_sent"]){
        const data = {
            request_id: response["request_id"]
        }
        const err = await updateUserKycInfoById(user.id,data)
        if (err != null) {
            return ["Unable to update request id in database", err]
        }
        
        return  ["OTP sent succesfully", null]
    }
    return ["Unable to send OTP", response["metadata"]["reason_message"]];
}
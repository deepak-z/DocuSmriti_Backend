import { externalApiCall } from "../utility/externalApiCall.js";
import { maskAadhaarNumber, validateDOB, validateGender, getAge, nameMatch } from "../utility/utility.js"
import constant from "../constants/constant.js";
import { kyc_info } from "../model/kyc_info.js";
import { saveUserKycInfoObject, getUserKycInfoByID, updateUserKycInfoById, updateUserKycStatus} from "../model/kyc_info.js";
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

    if(!validateDOB(req.body.dob)){
        return ["Invalid DOB, should be in DD/MM/YYYY format","INVALID REQUEST"]
    }

    if(!validateGender(req.body.gender)){
        return ["Invalid Gender, gender should be only M , F or T","INVALID_REQUEST"]
    }

    const user = req.user
    if(user.kyc_status == kyc_info.VERIFIED){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }

    const [kycInfo, err] = await getUserKycInfoByID(user.id)
    if(err != null){
        return ["Unable to get user kyc info", err]
    }

    const [maskedAaadhaarNumber,maskError] = maskAadhaarNumber(req.body.aadhaar_number)
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
        status: kyc_info.INITIATED,
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

export async function verifyUserKycInfo(req){
    if(!req.body.otp){
        return ["OTP not provided", "INVALID REQUEST"]
    }

    const user = req.user
    const otp = req.body.otp

    if(user.kyc_status == kyc_info.VERIFIED){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }

    const [kycInfo, err] = await getUserKycInfoByID(user.id)
    if(err != null){
        return ["Unable to get user kyc info", err]
    }
    if(kycInfo == null){
        return ["User kyc data not found", "KYC NOT INITIATED"]
    }

    const url = constant.ZOOP_ONE_OKYC_OTP_VERIFY_API
    let headers = new Map()
    headers.set("app-id", config.zoop.apiId)
    headers.set("api-key", config.zoop.apiKey)
    const body = {
        "data": {
            "request_id": kycInfo.request_id,
            "otp": otp,
            "consent": constant.ZOOP_ONE_CONSENT,
            "consent_text": constant.ZOOP_ONE_CONSENT_TEXT,
        },
    }
    const [status, response, zoopErr] = await externalApiCall('post', url, body, headers)
    if(zoopErr != null){
        return ["Unable to verify OTP", zoopErr]
    }
    if(status == 200 && response["success"] && (response["result"] != null)){
        const [kycChecksResponse, kycChecksErr] = userKycChecks(kycInfo,response["result"])

        var newStatus = kyc_info.IN_PROGRESS;
        var data = {
            selfie_string: response["result"]["user_profile_image"]
        }

        if(kycChecksErr != null) {
            newStatus = kyc_info.REJECTED
            data.rejection_reason = kycChecksResponse
        }

        const err = await updateUserKycStatus(kycInfo.user_id,newStatus)
        if(err != null){
            return ["Unable to update status in database", err]
        }

        const updateDataErr = await updateUserKycInfoById(user.id,data)
        if(updateDataErr != null){
                return ["Unable to update kyc info data in database", err]
        }

        return [kycChecksResponse,kycChecksErr]
    }
    return ["OTP Verification failed", response["metadata"]["reason_message"]];
}

function userKycChecks(kycInfo,zoopData){
    //1. DOB Check
    if(kycInfo.dob != zoopData["user_dob"]){
        return ["DOB mismatch, DOB should be in DD/MM/YYYY format","KYC_CHECK_FAILURE"]
    }

    //2. Age Check
    if(getAge(kycInfo.dob) < constant.AGE_LIMIT){
        return ["Age is less than 18", "KYC_CHECK_FAILURE"]
    }

    //3. Gender Check
    if(kycInfo.gender != zoopData["user_gender"]){
        return ["Gender Mismatch with Aadhaar Data", "KYC_CHECK_FAILURE"]
    }

    //4. Name Check
    if(!nameMatch(kycInfo.first_name + kycInfo.last_name,zoopData["user_full_name"])){
        return ["Name Mismatch with Aadhaar Data", "KYC_CHECK_FAILURE"]
    }

    return ["Kyc checks passed",null]
}

export async function verifyUserSelfie(req) {
    if(!req.body.selfie) {
        return ["Invalid or empty selfie string provided", "INVALID REQUEST"]
    }
    const user = req.user
    if(user.kyc_status == kyc_info.VERIFIED){ 
        return ["User kyc is already verified", "VERIFIED USER"]
    }
    if(user.kyc_status != kyc_info.IN_PROGRESS){ 
        return ["Step 1 and 2 not completed", "INVALID REQUEST"]
    }

    const [kycInfo, err] = await getUserKycInfo(req)
    if(err != null){
        return ["Unable to get user kyc info", err]
    }
    if(kycInfo == null){
        return ["User kyc data not found", "KYC NOT INITIATED"]
    }

    const url = constant.ZOOP_ONE_FACE_MATCH_API
    let headers = new Map()
    headers.set("app-id", config.zoop.apiId)
    headers.set("api-key", config.zoop.apiKey)
    const body = {
        "mode": "sync",
        "data": {
          "card_image":     kycInfo.selfie_string,
          "user_image":     req.body.selfie,
          "consent":        constant.ZOOP_ONE_CONSENT,
          "consent_text":   constant.ZOOP_ONE_CONSENT_TEXT
        },
    }
    const [status, response, zoopErr] = await externalApiCall('post', url, body, headers)
    if(zoopErr != null){
        return ["Unable to verify selfie", err]
    }
    if(status == 200 && response["success"]){
        var newStatus = kyc_info.VERIFIED
        var selfieResponseMessage = "Kyc verified successfully"
        var selfieResponseError = null
        var data = {}

        if (response["response_code"]!= 100 || response["result"]["face_match_score"] < constant.SELFIE_MATCH_SCORE_THRESOLD) {
            newStatus = kyc_info.REJECTED
            selfieResponseMessage = response["result"]? "Selfie match score is less than thresold" : response["metadata"]["reason_message"]
            selfieResponseError = "SELFIE NOT MATCHED"
            data.rejection_reason = response["result"]? `Selfie match score is ${response["result"]["face_match_score"]}` : response["metadata"]["reason_message"]
        } else {
            data.selfie_match_score = response["result"]["face_match_score"]
        }
        
        const err = await updateUserKycStatus(kycInfo.user_id, newStatus)
        if(err != null){
            return ["Unable to update selfie status", err]
        }
        const updatedErr = await updateUserKycInfoById(kycInfo.user_id, data)
        if(updatedErr != null){
            return ["Unable to update selfie details", updatedErr]
        }
        return [selfieResponseMessage, selfieResponseError]
    }
    return ["Unable to verify selfie", response["metadata"]["reason_message"]];
}
import { externalApiCall } from "./externalApiCall.js"
import { sendResponse } from "../utility/response.js";
import { getUserByEmail } from "../model/users.js";
import constant from "../constants/constant.js";


export async function verifyGoogleToken(req, res, next) {
    const token = getTokenFromHeader(req)
    if(token == ""){
        sendResponse(res, "No Token Found", "INVALID TOKEN")
        return
    }
    const url = `${constant.GOOGLE_TOKEN_API}?access_token=${token}`
    let headers = new Map()
    headers.set("Authorization", `Bearer ${token}`)
    const [status, response, err] = await externalApiCall('get', url, null, headers)
 
    if(err != null){
        sendResponse(res, "Invalid Token or Token Expired", "INVALID TOKEN")
        return
    }
    if(status != 200){
        sendResponse(res, "Token Expired", "INVALID TOKEN")
        return
    }
    req.userInfo = response
    next()
}

export function verifyUser(checkIsActive, checkKyc) {
    return async function(req, res, next){
        var [user, err] = await getUserByEmail(req.userInfo.email)
        if(err != null){
            sendResponse(res, "Unable to find user", err)
            return
        }
        if(user == null){
            sendResponse(res, "User not found", "INVALID USER")
            return
        }
        if(checkIsActive && !user.is_active){
            sendResponse(res, "User is blocked", "INACTIVE USER")
            return
        }
        if(checkKyc && user.kyc_status != "verified"){ 
            sendResponse(res, "User kyc is not verified", "UNVERIFIED USER")
            return
        }
        req.user = user
        next()
    }
}



function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return ""
}
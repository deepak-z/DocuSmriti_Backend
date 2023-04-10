import { externalApiCall } from "./externalApiCall.js"
import { sendResponse } from "../utility/response.js";
import { getUserByEmail } from "../model/users.js";
import constant from "../constants/constant.js";

const uri = "https://www.googleapis.com/oauth2/v1/userinfo"

export async function verifyGoogleToken(req, res, next) {
    const token = getTokenFromHeader(req)
    if(token == ""){
        sendResponse(res, "No Token Found", "INVALID TOKEN")
        return
    }
    const url = `${uri}?access_token=${token}`
    let headers = new Map()
    headers.set("Authorization", `Bearer ${token}`)
    const [status, response, err] = await externalApiCall('get', url, {}, headers)
 
    if(err != null){
        sendResponse(res, "", err)
        return
    }
    if(status != 200){
        sendResponse(res, "Token Expired", "INVALID TOKEN")
        return
    }
    req.userInfo = response
    next()
}

export function verifyUser(checkIsActive, checkKyc, checkIsWalletLiked, checkIsCustodialWalletLiked) {
    return async function(req, res, next){
        var [user, err] = await getUserByEmail(req.userInfo.email)
        if(err != null){
            return ["Unable to find user", err]
        }
        if(user != null){
            return ["User not found", "INVALID USER"]
        }
        if(checkIsActive && !user.is_active){
            return ["User is blocked", "INACTIVE USER"]
        }
        if(checkKyc){ //@TODO add kyc check
            return ["User kyc is not verified", "UNVERIFIED USER"]
        }
        if(checkIsCustodialWalletLiked && user.wallet_type != constant.CUSTODIAL_WALLET){
            return ["Wallet is not linked", "WALLET NOT LINKED"]
        }
        req.user = user
        next();
    }
}



function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return ""
}
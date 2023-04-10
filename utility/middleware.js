import { externalApiCall } from "./externalApiCall.js"
import { sendResponse } from "../utility/response.js";
import { getUserByEmail } from "../model/users.js";

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

export function verifyUser(checkIsActive, checkKyc, checkIsWalletLiked, verifyLinkedWallet) {
    return async function(req, res, next){
        var [user, err] = await getUserByEmail(req.userInfo.email)
        console.log(user.wallet_address);
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
        if(checkIsWalletLiked && user.wallet_address == ""){
            return ["Wallet is not linked this user", "WALLET NOT LINKED"]
        }
        if(verifyLinkedWallet && user.wallet_address != req.body.walletAddress){
            return ["Wallet does not belongs to this user", "INVALID WALLET ADDRESS"]
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
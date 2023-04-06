import { externalApiCall } from "./externalApiCall.js"
import { sendResponse } from "../utility/response.js";

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

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return ""
}
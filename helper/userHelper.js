import { createUser, getUserByEmail, getAllUserInfo } from "../model/users.js";
import { getAllKycInfo, kyc_info } from "../model/kyc_info.js";
import constant from "../constants/constant.js";

export async function userLogIn(req) {
    var [user, err] = await getUserByEmail(req.userInfo.email)
    if(err != null){
        return ["Unable to find user", err]
    }
    if(user != null){
        return [user, null]
    }
    [user, err] = await createUser(req)
    if(err != null){
        return ["Unable to create user", err]
    }
    return [user, null]
}


export async function getKycStatistics(req) {
    if (!req.body.start_date) {
        var d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        req.body.start_date = d
    }
    if (!req.body.end_date) {
        req.body.end_date = new Date()
    }
    const [kycData, err] = await getAllKycInfo(req.body.start_date, req.body.end_date)
    if (err != null) {
        return ["Unable to get kyc info from database", err]
    }
    var totalUsers = kycData.length
    var not_verified = 0
    var initiated = 0
    var verified = 0
    var rejected = 0
    for (let i = 0; i < kycData.length; i++) {
        switch(kycData[i].status) {
            case kyc_info.INITIATED:
                initiated++
                break;
            case kyc_info.IN_PROGRESS:
                initiated++
                break;
            case kyc_info.NOT_VERIFIED:
                not_verified++
                break;
            case kyc_info.REJECTED:
                rejected++
                break;
            default:
              verified++
          }
    }
    const response = {
        "kyc_verified" : verified,
        "kyc_rejected" : rejected,
        "kyc_not_verified" : not_verified,
        "kyc_in_progress" : initiated,
        "total_users" : totalUsers,
    }
    return [response, null]
}


export async function getUserStatistics(req) {
    if (!req.body.start_date) {
        var d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        req.body.start_date = d
    }
    if (!req.body.end_date) {
        req.body.end_date = new Date()
    }
    const [userData, err] = await getAllUserInfo(req.body.start_date, req.body.end_date)
    if (err != null) {
        return ["Unable to get user info from database", err]
    }
    var totalUsers = userData.length
    var verified = 0
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].kyc_status == kyc_info.VERIFIED) {
            verified++
        }
    }
    const response = {
        "kyc_verified" : verified,
        "total_user_registered" : totalUsers,
    }
    return [response, null]
}
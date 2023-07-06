import { createUser, getUserByEmail, getAllUserInfo} from "../model/users.js";
import constant from "../constants/constant.js";
import { kyc_info } from "../model/kyc_info.js";

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
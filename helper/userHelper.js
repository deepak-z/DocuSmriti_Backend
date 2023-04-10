import { createUser, getUserByEmail, addWallet } from "../model/users.js";
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

export async function linkUserWallet(req) {
    const wallet = req.body.wallet.toUpperCase()
    if(wallet != constant.CUSTODIAL_WALLET || wallet != constant.METAMASK_WALLET) {
        return ["Invalid wallet type provided", "INVALID WALLET TYPE"]
    }
    var [user, err] = await getUserByEmail(req.userInfo.email)
    if(err != null){
        return ["Unable to find user", err]
    }
    if(user.wallet_type != ""){
        return [{"message":"Wallet already linked"}, null]
    }
    [user, err] = await addWallet(wallet)
    if(err != null){
        return ["Unable to link wallet with user", err]
    }
    return [user, null]
}
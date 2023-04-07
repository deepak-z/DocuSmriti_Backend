import { createUser, getUserByEmail, getUserByWalletAddress, addWallet } from "../model/users.js";

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
    var [user, err] = await getUserByEmail(req.userInfo.email)
    if(err != null){
        return ["Unable to find user", err]
    }
    const userEmail = user.email;
    [user, err] = await getUserByWalletAddress(req.body.walletAddress)
    if(err != null){
        return ["Unable to find user", err]
    }
    if(user != null){
        if(userEmail == user.email){
            return [{"message":"Wallet already linked"}, null]
        }
        return ["Wallet linked to another user", "INVALID WALLET LINKED"]
    }
    [user, err] = await addWallet(req)
    if(err != null){
        return ["Unable to link wallet with user", err]
    }
    return [user, null]
}
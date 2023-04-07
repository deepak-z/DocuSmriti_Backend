import { createUser, getUserByEmail } from "../model/users.js";

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


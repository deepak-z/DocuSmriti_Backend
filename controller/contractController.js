import { addContract } from "../helper/contractHelper.js"
import { sendResponse } from "../utility/response.js"

export async function AddContract(req, res, next){
    const [response, err] =  await addContract(req)
    sendResponse(res, response, err)
}
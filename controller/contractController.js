import { addContract, estimateGasPrice } from "../helper/contractHelper.js"
import { sendResponse } from "../utility/response.js"

export async function AddContract(req, res, next){
    const [response, err] =  await addContract(req)
    sendResponse(res, response, err)
}

export async function EstimateGasPrice(req, res, next) {
    const [response, err] = await estimateGasPrice(req)
    sendResponse(res, response, err)
}

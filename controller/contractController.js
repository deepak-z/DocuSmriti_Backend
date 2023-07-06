import { addContract, estimateAddContractGasPrice, approveTransaction, estimateAcceptContractGasPrice, getContractAdminData, changeContractCreatePrice } from "../helper/contractHelper.js"
import { sendResponse } from "../utility/response.js"

export async function AddContract(req, res, next){
    const [response, err] =  await addContract(req)
    sendResponse(res, response, err)
}

export async function EstimateAddContractGasPrice(req, res, next) {
    const [response, err] = await estimateAddContractGasPrice(req)
    sendResponse(res, response, err)
}

export async function ApproveTransaction(req, res, next){
    const [response, err] =  await approveTransaction(req)
    sendResponse(res, response, err)
}

export async function EstimateAcceptContractGasPrice(req, res, next) {
    const [response, err] = await estimateAcceptContractGasPrice(req)
    sendResponse(res, response, err)
}

export async function GetContractData(req,res,next) {
    const [response, err] = await getContractAdminData(req)
    sendResponse(res, response, err)
}

export async function ChangeContractCreatePrice(req,res,next) {
    const [response, err] = await changeContractCreatePrice(req)
    sendResponse(res, response, err)
}

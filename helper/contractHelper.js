import config from "../config/config.js"
import Web3 from "web3"
import abi from "../utility/contractABI.js"

const _from = config.blockchain.docuSmritiWalletAddress
const _privateKey = config.blockchain.docuSmritiWalletPrivateKey
const _contractAddress =  config.blockchain.contractAddress
const _providerURL = config.blockchain.rpcUrl + "/" + config.blockchain.alchemyApiKey;

const web3 = new Web3(new Web3.providers.HttpProvider(_providerURL))
const contract = new web3.eth.Contract(abi, _contractAddress);
web3.eth.accounts.wallet.add(_privateKey);

export async function addContract(req) { 
  try{
    const isValidRequest = validateRequest(req)
    if(!isValidRequest) {
        return ["parameters can't be empty", "INVALID_REQUEST"]
    }
    const currentDate = new Date().getTime().toString()
    const txn = contract.methods.addContract(req.body.category, req.body.description, req.body.name, req.userInfo.email, req.body.start_date, 
                                                req.body.end_date, currentDate, req.body.sha256, req.body.ipfsUrl, req.body.addresses, req.body.inviteEmails)
    const gasLimit = await txn.estimateGas({from: _from})
    const gasPrice = await web3.eth.getGasPrice();
    const data = txn.encodeABI();
    const nonce = await web3.eth.getTransactionCount(_from)
    const [price, err] = await getContractPrice()
    if(err != null) {
        return ["unable to fetch contract price", err]
    }
    const txnData = {
      from:     _from,
      to:       _contractAddress,
      value:    price,
      data,
      gasLimit,
      gasPrice,
      nonce,
    }
    console.log('Transaction ready to be sent');
    const response = await web3.eth.sendTransaction(txnData)
    console.log(`Transaction sent, hash is ${JSON.stringify(response)}`);
    return [response, null]
  }
  catch(err){
    console.log("error in adding contract", err);
    return [null, err]
  }
}

export async function estimateGasPrice(req) { 
  try{
    const isValidRequest = validateRequest(req)
    if(!isValidRequest) {
        return ["parameters can't be empty", "INVALID_REQUEST"]
    }
    const [contractFeeInWei, err] = await getContractPrice()
    if(err != null) {
        return ["unable to fetch contract price", err]
    }
    const [ethPrice, err0] = await getEthPrice()
    if(err0 != null) {
        return ["unable to fetch eth price", err0]
    }
    
    const currentDate = new Date().getTime().toString()
    const txn = contract.methods.addContract(req.body.category, req.body.description, req.body.name, req.userInfo.email, req.body.start_date, 
                                                req.body.end_date, currentDate, req.body.sha256, req.body.ipfsUrl, req.body.addresses, req.body.inviteEmails)
    
    const priceMargin = 1
    const gasLimit = await txn.estimateGas({from: _from})
    const gasPriceInWei = await web3.eth.getGasPrice()
    const contractFeeInEther = Web3.utils.fromWei(contractFeeInWei, 'ether')
    const totalGasFeeInWei = Math.round(gasLimit * gasPriceInWei * priceMargin)
    const totalGasFeeInEther = Web3.utils.fromWei(`${totalGasFeeInWei + parseInt(contractFeeInWei, 10)}`, 'ether')
    const response = {
        "gas_limit" :           Math.round(gasLimit * priceMargin),
        "gas_price_in_wei" :    parseInt(gasPriceInWei, 10),
        "contract_fee_in_wei" : parseInt(contractFeeInWei, 10),
        "gas_fee_in_wei" :      totalGasFeeInWei,
        "total_fee_in_wei" :    totalGasFeeInWei + parseInt(contractFeeInWei, 10),
        "total_fee_in_ether" :  totalGasFeeInEther + parseInt(contractFeeInEther, 10),
        "total_fee_in_inr" :    Math.max(100, (totalGasFeeInWei + parseInt(contractFeeInWei, 10)) * ethPrice)
    }
    return [response, null]
  }
  catch(err){
    console.log("error estimating gas price", err);
    return [null, err]
  }
}

async function getContractPrice(){
    try{
        const result = await contract.methods.getContractCreatePrice().call()
        return [result, null]
    }
    catch(err) {
        return [null, err]
    }
}

async function getEthPrice(){
  try{
    //@TODO fetch price from binance
      return [0, null]
  }
  catch(err) {
      return [null, err]
  }
}

function validateRequest(req){
    if(typeof req.body.category != "string" || typeof req.body.description != "string" || typeof req.body.name != "string" ||  typeof req.body.start_date != "string" ||
    typeof req.body.end_date != "string"  || typeof req.body.sha256 != "string" || typeof req.body.ipfsUrl != "string") {
        return false
    }
    return true
}
import config from "../config/config.js"
import Web3 from "web3"
import abi from "../utility/contractABI.js"

const _from = config.blockchain.docuSmritiWalletAddress
const _privateKey = config.blockchain.docuSmritiWalletPrivateKey
const _contractAddress =  config.blockchain.contractAddress
const _providerURL = config.blockchain.rpcUrl + "/" + config.blockchain.alchemyApiKey

const web3 = new Web3(new Web3.providers.HttpProvider(_providerURL))
const contract = new web3.eth.Contract(abi, _contractAddress)
web3.eth.accounts.wallet.add(_privateKey)

export async function addContract(req) { 
  try{
    const isValidRequest = validateRequest(req)
    if(!isValidRequest) {
        return ["parameters can't be empty", "INVALID_REQUEST"]
    }
    const currentDate = new Date().toLocaleDateString('en-GB');
    const txn = contract.methods.addContract(req.body.category, req.body.description, req.body.name, req.userInfo.email, req.body.start_date, 
                                                req.body.end_date, currentDate, req.body.sha256, req.body.ipfsUrl, req.body.inviteEmails)

    const [price, err] = await getContractPrice()
    if(err != null) {
      return ["unable to fetch contract price", err]
    }

    const gasLimit = await txn.estimateGas({from: _from,value: price})
    const gasPrice = await web3.eth.getGasPrice()
    const data = txn.encodeABI()
    const nonce = await web3.eth.getTransactionCount(_from)

    const txnData = {
      from:     _from,
      to:       _contractAddress,
      value:    price,
      data,
      gasLimit,
      gasPrice,
      nonce,
    }
    console.log('Transaction ready to be sent')
    const response = await web3.eth.sendTransaction(txnData)
    console.log(`Transaction sent, hash is ${JSON.stringify(response)}`)
    return [response, null]
  }
  catch(err){
    console.log("error in adding contract", err.message)
    return [null, err.message]
  }
}

export async function estimateAddContractGasPrice(req) { 
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
                                                req.body.end_date, currentDate, req.body.sha256, req.body.ipfsUrl, req.body.inviteEmails)
    
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
    console.log("error estimating gas price", err)
    return [null, err.message]
  }
}

export async function estimateAcceptContractGasPrice(req) { 
  try{
    if(!req.body.sha256) {
        return ["parameters can't be empty", "INVALID_REQUEST"]
    }
    const [ethPrice, err] = await getEthPrice()
    if(err != null) {
        return ["unable to fetch eth price", err]
    }
    
    const txn = contract.methods.approveTransaction(req.userInfo.email, req.body.sha256)

    const priceMargin = 1
    const gasLimit = await txn.estimateGas({from: _from})
    const gasPriceInWei = await web3.eth.getGasPrice()
    const totalGasFeeInWei = Math.round(gasLimit * gasPriceInWei * priceMargin)
    const totalGasFeeInEther = Web3.utils.fromWei(`${totalGasFeeInWei}`, 'ether')
    const response = {
        "gas_limit" :           Math.round(gasLimit * priceMargin),
        "gas_price_in_wei" :    parseInt(gasPriceInWei, 10),
        "total_fee_in_wei" :    totalGasFeeInWei,
        "total_fee_in_ether" :  totalGasFeeInEther,
        "total_fee_in_inr" :    Math.max(100, (totalGasFeeInWei) * ethPrice)
    }
    return [response, null]
  }
  catch(err){
    console.log("error estimating gas price", err)
    return [null, err.message]
  }
}

export async function approveTransaction(req) { 
  try{
    if(!req.body.sha256) {
      return ["parameters can't be empty", "INVALID_REQUEST"]
    }
    const txn = contract.methods.approveTransaction(req.userInfo.email, req.body.sha256)
    const gasLimit = await txn.estimateGas({from: _from})
    const gasPrice = await web3.eth.getGasPrice()
    const data = txn.encodeABI()
    const nonce = await web3.eth.getTransactionCount(_from)

    const txnData = {
      from:     _from,
      to:       _contractAddress,
      data,
      gasLimit,
      gasPrice,
      nonce,
    }
    console.log('Transaction ready to be sent')
    const response = await web3.eth.sendTransaction(txnData)
    console.log(`Transaction sent, hash is ${JSON.stringify(response)}`)
    return [response, null]
  }
  catch(err){
    console.log("error in adding contract", err)
    return [null, err.message]
  }
}

export async function getContractAdminData(req) {

  if (!req.body.create_date){
    return ["Create Date not provided or invalid", "INVALID REQUEST"]
  }

  const [contractData, dataErr] = await getContractData()
  if (dataErr != null) {
    return ["unable to fetch contact data", dataErr]
  }

  const [contractCount, countErr] = await getContractsByDate(req.body.create_date)
  if (dataErr != null) {
    return ["unable to fetch contact data", countErr]
  }

  
  return [{
    "contract_create_price": (contractData[0] / 1000000000000000000),
    "contract_balance": (contractData[1]/ 1000000000000000000),
    "contract_count": contractCount
  }, null]

}

export async function changeContractCreatePrice(req) {
  if (!req.body.contract_create_price){
    return ["Contract Create Price not provided or invalid", "INVALID REQUEST"]
  }

  const contractCreatePrice = req.body.contract_create_price * 1000000000000000000;
  const contractCreatePriceString = contractCreatePrice.toString()

  try{
    const txn = contract.methods.setPrice(contractCreatePriceString)
    const gasLimit = await txn.estimateGas({from: _from})
    const gasPrice = await web3.eth.getGasPrice()
    const data = txn.encodeABI()
    const nonce = await web3.eth.getTransactionCount(_from)

    const txnData = {
      from:     _from,
      to:       _contractAddress,
      data,
      gasLimit,
      gasPrice,
      nonce,
    }
    console.log('Transaction ready to be sent')
    const response = await web3.eth.sendTransaction(txnData)
    console.log(`Transaction sent, hash is ${JSON.stringify(response)}`)
    return [response, null]
  }
  catch(err){
    console.log("error in adding contract", err)
    return [null, err.message]
  }
}

async function getContractPrice(){
    try{
        const result = await contract.methods.getContractCreatePrice().call()
        return [result, null]
    }
    catch(err) {
        return [null, err.message]
    }
}

async function getContractData(){
  try{
    const result = await contract.methods.getContractData().call({from: _from});
    return [result, null]
  }
  catch(err) {
      return [null, err.message]
  }
}

async function getContractsByDate(createDate){
  try{
    const result = await contract.methods.getContractsCount_date(createDate).call({from: _from});
    return [result, null]
  }
  catch(err) {
      return [null, err.message]
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
    if(!req.body.category  ||  !req.body.description  ||  !req.body.name  ||   !req.body.start_date  ||
     !req.body.end_date   ||  !req.body.sha256  ||  !req.body.ipfsUrl ) {
        return false
    }
    return true
}
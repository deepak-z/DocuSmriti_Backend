import config from "../config/config.js"
import Web3 from "web3";
import abi from "../utility/contractABI.js";

const _from = config.blockchain.docuSmritiWalletAddress
const _privateKey = config.blockchain.docuSmritiWalletPrivateKey
const _contractAddress =  config.blockchain.contractAddress
const _providerURL = config.blockchain.rpcUrl + config.blockchain.alchemyApiKey;

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
    const nonce = await web3.eth.getTransactionCount(_from);
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


async function getContractPrice(){
    try{
        const result = await contract.methods.ContractCreatePrice().call()
        return [result, null]
    }
    catch(err) {
        return [null, err]
    }
}

function validateRequest(req){
    if(req.body.category == "" || req.body.desc == "" || req.body.name == "" ||  req.body.start_date == "" ||
        req.body.end_date == ""  || req.body.sha256 == "" || req.body.ipfsUrl == "") {
            console.log("err");
        return false
    }
    return true
}
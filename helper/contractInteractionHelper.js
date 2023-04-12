import config from "../config/config.js";
import Web3 from "web3";
import abi from "../utility/contractABI.js";

const provideURL =
  config.blockchain.alchemyDocusmritiSepoliaHTTPURL +
  "/" +
  config.blockchain.alchemyDocusmritiSepoliaApiKey;

const web3 = new Web3(new Web3.providers.HttpProvider(provideURL));

const contract = new web3.eth.Contract(abi, config.blockchain.contractAddress);

console.log(provideURL);

// // 1. Testing Reading Function
// contract.methods
//   .ContractCreatePrice()
//   .call()
//   .then((result) => console.log(`The Contract Create Price is ${result}`))
//   .catch((error) => console.error(error));

// // 2. Testing Reading Function With Arguments
// contract.methods
//   .getUserKycInfo(config.blockchain.docuSmritiWalletAddress)
//   .call()
//   .then((result) => console.log(`The Kyc Info for this address is ${result}`))
//   .catch((error) => console.error(error));

// 3. Signing a Transaction Function
const send = async () => {
  const _from = config.blockchain.docuSmritiWalletAddress;
  const privateKey = config.blockchain.docuSmritiWalletPrivateKey;

  const tx = {
    from: _from.toString(),
    to: config.blockchain.contractAddress,
    gas: 30000000,
    data: contract.methods
      .addUserKycInfo(
        "asdf",
        "asdf",
        "asdf",
        "asdf",
        "asdf",
        "asdf",
        "asdf",
        "asdf",
        "balleBalle"
      )
      .encodeABI(),
  };

  //console.log(tx);
  const signature = await web3.eth.accounts.signTransaction(tx, privateKey);
  console.log(signature);
  const transactionReceipt = await web3.eth.sendSignedTransaction(
    signature.rawTransaction
  );

  console.log("Transaction hash:", transactionReceipt.transactionHash);
};

//send();

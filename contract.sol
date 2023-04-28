// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';


contract CreateContract is Ownable {

  using Strings for uint256;


  struct structContractInfo { 
      string Category;
      string Desc;
      string Name;
      string Email;
      string StartDate;
      string EndDate;
      string CreateDate;
      string IPFSURI;
  }


  uint256 public ContractCreatePrice = 0 ether;


  mapping(string => structContractInfo) public ContractsMap;
  mapping(string => string[]) public ContractCreatorMap;

  mapping(string => string[]) public emailsInvolvedInContractMap;

  mapping(string => string[]) public signatureNeededMap;

  mapping(string => mapping(string => bool)) public isConfirmed;

  function addContract(string memory _category,
                      string memory _desc,
                      string memory _name,
                      string memory _email,
                      string memory _st_date,
                      string memory _end_date,
                      string memory _createdate,
                      string memory _SHA256,
                      string memory _IPFSURI,
                      string[] memory _emails
                      ) public payable {

    //require(!isContractPaused, 'Contract is paused.');
    require(bytes(_SHA256).length >= 0, 'Invalid Document Code.');
    //require(msg.value >= 1000000000000000000, 'Not Enough Funds!');
    require(bytes(ContractsMap[_SHA256].Category).length == 0, 'Document already exists.');

    ContractsMap[_SHA256] = structContractInfo(_category,_desc, _name, _email, _st_date, _end_date, _createdate, _IPFSURI);
    ContractCreatorMap[_email].push(_SHA256);

    emailsInvolvedInContractMap[_SHA256].push(_email);
    isConfirmed[_email][_SHA256] = true;

    populateMaps(_emails,_email,_SHA256);
    //DailyContractCount[_createdate] += 1;
  }

 function populateMaps(string[] memory _emails,string memory _email, string memory _sha256) private {
        for (uint i = 0; i < _emails.length; i++) {
            string memory email = _emails[i];
            require(keccak256(bytes(email)) != keccak256(bytes(_email)),"Email cannot be same as owner");
            emailsInvolvedInContractMap[_sha256].push(email);
            signatureNeededMap[email].push( _sha256);

            isConfirmed[email][_sha256] = false;
        }
  }

  function getContractInfo(string memory _email, string memory _sha256) public view returns (string[] memory, bool[] memory, bool, bool) {

        string[] memory allEmails = emailsInvolvedInContractMap[_sha256];
        bool[] memory statuses = new bool[](allEmails.length);
        bool isAllSigned = true;
        bool isSelfSigned = isConfirmed[_email][_sha256];

        for (uint i = 0; i < allEmails.length; i++) {
            string memory email = allEmails[i];
            statuses[i] = isConfirmed[email][_sha256];
            if (!isConfirmed[email][_sha256]){
              isAllSigned = false;
            }
        }
        return (allEmails, statuses ,isAllSigned, isSelfSigned);
    }

  function getContractsCount_address(string memory _email) public view returns ( uint256 ) {
    return ContractCreatorMap[_email].length;
  }

  function getContract(string memory _SHA256) public view returns ( structContractInfo memory ) {
    return ContractsMap[_SHA256];
  }

    function getAllInvitedContracts(string memory _email) public view returns (string[] memory) {
        return signatureNeededMap[_email];
    }

  function getContractbyCreator(string memory _email) public view returns ( string[] memory ) {
      return ContractCreatorMap[_email];
  }

        //accept invite
    function approveTransaction(string memory _email, string memory _sha256) public {
        isConfirmed[_email][_sha256] = true;
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

    function withdraw() public  {
      (bool os, ) = payable(owner()).call{value: address(this).balance}('');
      require(os);
  }



 function getContractCreatePrice() public view returns (uint256) {
      return ContractCreatePrice;
  }







    //   function getContractsCount_date(string memory _createdate) public view returns ( uint256 ) {
    //     return DailyContractCount[_createdate];
    //   }

    //   function getContractBalance() public view returns ( uint256 ) {
    //     return(address(this).balance);
    //   }


    //   function withdraw() public onlyOwner {
    //     (bool os, ) = payable(owner()).call{value: address(this).balance}('');
    //     require(os);
    //   }

    //   mapping(address => uint256) internal OrgOwners;
    //   mapping(string => uint256) internal DailyContractCount;
    //   bool public isContractPaused = false;


    //   constructor(
    //   ) {
    //     OrgOwners[_msgSender()] = 1;
    //   }

    
    //   function isOrgOwner(address _add) public view returns (bool) {
    //     return OrgOwners[_add] > 0
    //         ? true
    //         : false;
    //   }


    //   function addOrgOwner(address _orgOwner) public onlyOwner {
    //      OrgOwners[_orgOwner] = 1;
    //   }

    //   function setContractState(bool _pauseState) public onlyOwner {
    //     isContractPaused = _pauseState;
    //   }

    //   function setPrice(uint256 _price) public onlyOwner {
    //     // price can be set to 0
    //     ContractCreatePrice = _price;
    //   }



  fallback() external  {
  }

  
}
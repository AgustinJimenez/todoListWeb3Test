// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*  
contactsCount {
    'address1': 30,
    'address3': 20,
    'address2': 5,
}
contacts {
    'address1': {
        
    },
    'address3': {
        
    },,
    'address2': {
        
    },
}

*/

contract Pay 
//is ERC20 
    {
    mapping(address => uint) public contactsCount;
    mapping(address => mapping(uint => Contact)) public contacts;

    struct Contact {
        uint id;
        string fullname;
        address wallet_address;
    }

    // constructor() ERC20("Pay", "Pay") {}
    constructor() {}
/* 
    function getContacts() public view returns (mapping(uint =>  Contact)) {
        Contact[] memory contactsArray = contacts.;
        for(uint i = 0; i < myVariable.sizeOfMapping; i++) {
            memoryArray[i] = myVariable.myMappingInStruct[i];
        }
        return contacts[msg.sender];
    }
 */
    function getBalance(address user_address) public view returns (uint256) {
        // uint256 balance = this.getBalance(user_address);
        uint balance = address(user_address).balance;
        return balance;
    }

}

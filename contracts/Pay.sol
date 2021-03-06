// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Pay is ERC20 {
    constructor() ERC20("Pay", "Pay") {
        owner = payable(msg.sender); // address that deploys contract will be the owner
    }
    event NewContactWasCreated();

    address payable owner;   
    mapping(address => Contact[]) private contacts;
    struct Contact {
        string full_name;
        address wallet_address;
    }

    function getContacts() public view returns (Contact[] memory) {
        return contacts[msg.sender];
    }
    function getContacts(address _address) public view returns (Contact[] memory) {
        return contacts[_address];
    }

    function addContact(string memory _full_name, address _address) public {
        contacts[msg.sender].push(
            Contact(
                _full_name,
                _address
            )
        );
        emit NewContactWasCreated();
    }

    function payEthToContact(uint _id) public payable {//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        require(msg.value > 0, "Invalid value...");
        require(msg.sender.balance > msg.value, "Not enought balance...");
        Contact[] memory contact_list = contacts[msg.sender];
        console.log("balance: ", msg.sender.balance, ", value:", msg.value );
        console.log("HERE ===> : len", contact_list.length, ", id: ", _id);
        require(_id <= contact_list.length, "Contact not found...");
        Contact memory contact = contact_list[_id];
        console.log("two");
        address contact_address = contact.wallet_address;
        console.log("three");
        address payable contact_address_pay = payable(contact_address);
        contact_address_pay.transfer(msg.value);
        // transfer(contact_address_pay, msg.value);
    }

    function getBalance() public view returns (uint256){
        return msg.sender.balance;
        // return address(0xD603F3A9DAbE385C9c8ce0dE1A97e096c9c6be4b).balance / 1000000000000000000;
        // return balanceOf(msg.sender);
        // return balanceOf(0xD603F3A9DAbE385C9c8ce0dE1A97e096c9c6be4b);
    }


}

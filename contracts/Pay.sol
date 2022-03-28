// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pay is ERC20 {

    constructor() ERC20("Pay", "Pay") {
    //
    }

    function getBalance(address user_address) public view returns (uint256) {
        // uint256 balance = this.getBalance(user_address);
        uint256 balance = address(user_address).balance;
        return balance;
    }

}

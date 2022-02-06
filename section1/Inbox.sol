// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Inbox {
    string message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public returns(uint) {
        message = newMessage;
        return 0;
    }

    function getMessage() public view returns(string memory) {
        return message;
    }
}
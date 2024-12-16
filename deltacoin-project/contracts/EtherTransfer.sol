// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherTransfer {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    receive() external payable {}

    function transfer(address payable _to) public payable {
        require(msg.value > 0, "Le montant du transfert doit etre superieur a zero");
        require(_to != address(0), "Adresse de destination invalide");

        _to.transfer(msg.value);

        emit Transfer(msg.sender, _to, msg.value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
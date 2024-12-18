// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

error OnlyOwner(
    address sender,
    address owner
);

contract Owner {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            OnlyOwner(
                msg.sender,
                owner
            )
        );
        _;
    }
}
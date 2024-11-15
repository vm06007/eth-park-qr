// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

contract MirroredOracle {
    address owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "OnlyOwner"
        );
        _;
    }

}
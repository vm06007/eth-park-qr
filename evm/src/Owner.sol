// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

error OnlyOwner(
    address sender,
    address owner
);

contract Owner {
    address owner;

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
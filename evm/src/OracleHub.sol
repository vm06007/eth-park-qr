// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

error OnlyOwnerOracleHub(
    address sender,
    address owner
);

contract OracleHub {
    address owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            OnlyOwnerOracleHub(
                msg.sender,
                owner
            )
        )
        _;
    }

    function addFeed(
        address tokenAddress,
        address oracle
    )
        onlyOwner
        external
    {

    }

    function getBahtAmount(
        address tokenAddress,
        uint256 tokenAmount
    )
        external
        returns (uint256)
    {

    }

    function getTokenAmount(
        address tokenAddress,
        uint256 bahtAmount
    )
        external
        returns (uint256)
    {

    }
}
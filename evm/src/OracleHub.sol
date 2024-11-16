// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

contract OracleHub is Owner {
    mapping(address => address) public tokenPriceFeeds;

    address public thbUsdPriceFeedAddress;
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    constructor() {

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

    function getTokenEquivalent(
        address token,
        uint256 bahtAmount
    )
        external
        view
        returns (uint256 tokenAmount)
    {
    }
}
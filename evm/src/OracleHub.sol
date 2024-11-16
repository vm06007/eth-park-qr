// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

import "./Interfaces/AggregatorV3Interface.sol";

error InvalidPrice();

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

    function setTokenPriceFeed(
        address token,
        address priceFeed
    )
        onlyOwner
        external
    {
        tokenPriceFeeds[token] = priceFeed;
    }

    function getBahtEquivalent(
        address tokenAddress,
        uint256 tokenAmount
    )
        external
        returns (uint256 bahtAmount)
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

    function getDecimals(
        address priceFeedAddress
    )
        internal
        view
        returns (uint8 decimals)
    {
        decimals = AggregatorV3Interface(priceFeedAddress).decimals();
    }
}
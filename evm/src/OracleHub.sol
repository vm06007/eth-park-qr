// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

contract OracleHub is Owner {
    address THBFEED = 0x5164Ad28fb12a5e55946090Ec3eE1B748AFb3785;
    mapping(address => address) public tokenPriceFeeds;
    address public thbUsdPriceFeedAddress;
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    constructor() {
        owner = msg.sender;
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
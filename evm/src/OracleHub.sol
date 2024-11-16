// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

import "./Interfaces/AggregatorV3Interface.sol";
import "./Interfaces/IERC20.sol";

error InvalidPrice();

contract OracleHub is Owner {
    mapping(address => address) public tokenPriceFeeds;

    address public thbUsdPriceFeedAddress;
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    constructor(
        address _thbUsdPriceFeedAddress
    )
    {
        thbUsdPriceFeedAddress = _thbUsdPriceFeedAddress;
    }

    function getLatestPrice(
        address priceFeedAddress
    )
        internal
        view
        returns (uint256 price)
    {
        (, int256 answer, , , ) = AggregatorV3Interface(priceFeedAddress).latestRoundData();

        require(
            answer > 0,
            InvalidPrice()
        );

        return uint256(
            answer
        );
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
        view
        returns (uint256 bahtAmount)
    {
        uint256 thbUsdPrice = getLatestPrice(
            thbUsdPriceFeedAddress
        );

        uint256 tokenUsdPrice = getLatestPrice(
            tokenPriceFeeds[tokenAddress]
        );

        uint8 thbUsdDecimals = getDecimals(
            thbUsdPriceFeedAddress
        );

        uint8 tokenUsdDecimals = getDecimals(
            tokenPriceFeeds[tokenAddress]
        );

        uint8 tokenDecimals = tokenAddress == NATIVE ? 18 : IERC20(tokenAddress).decimals();
        uint256 adjustedTokenUsdPrice = tokenUsdPrice * (10 ** (18 - tokenUsdDecimals));
        uint256 usdAmount = tokenAmount
            * adjustedTokenUsdPrice
            / (10 ** tokenDecimals);

        uint256 adjustedThbUsdPrice = thbUsdPrice
            * (10 ** (18 - thbUsdDecimals));

        bahtAmount = (usdAmount * (10 ** 18))
            / adjustedThbUsdPrice;
    }

    function getTokenEquivalent(
        address token,
        uint256 bahtAmount
    )
        external
        view
        returns (uint256 tokenAmount)
    {
        uint256 thbUsdPrice = getLatestPrice(
            thbUsdPriceFeedAddress
        );

        uint256 tokenUsdPrice = getLatestPrice(
            tokenPriceFeeds[token]
        );

        uint8 thbUsdDecimals = getDecimals(
            thbUsdPriceFeedAddress
        );

        uint8 tokenUsdDecimals = getDecimals(
            tokenPriceFeeds[token]
        );

        uint8 tokenDecimals = token == NATIVE
            ? 18
            : IERC20(token).decimals();

        uint256 usdAmount = (bahtAmount * thbUsdPrice)
            / (10 ** thbUsdDecimals);

        uint256 adjustedTokenUsdPrice = tokenUsdPrice
            * (10 ** (18 - tokenUsdDecimals));

        tokenAmount = (usdAmount * (10 ** tokenDecimals))
            / adjustedTokenUsdPrice;
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
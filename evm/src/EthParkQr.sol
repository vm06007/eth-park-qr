// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.28;

contract EthParkQr {

    struct OrderData {
        address token;
        uint256 bahtAmount;
        string baseUrl;
        string referenceString;
    }

    function payQr(
        address token,
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        external
    {

    }


    function settleOrder(
        address beneficiary,
        OrderData memory orderData
    )
        external
    {

    }
}

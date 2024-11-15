// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

error OnlyOwner(
    address sender,
    address owner
);

contract EthParkQr {

    address owner;
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

    function payQrNative(
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        external
        payable
    {
        uint256 neededAmount; // calc later

        if (msg.value > neededAmount) {
            payable(msg.sender).transfer(msg.value - neededAmount);
        }
    }

}

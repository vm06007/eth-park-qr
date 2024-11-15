// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

error OnlyOwner(
    address sender,
    address owner
);

contract EthParkQr {

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
        onlyOwner
        external
    {

    }

    function settleOrderNative(
        address beneficiary,
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        onlyOwner
        external
    {
        // maybe use nativeAddress reference later
    }

    function payQrNative(
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        onlyOwner
        external
        payable
    {
        uint256 neededAmount; // calc later

        if (msg.value > neededAmount) {
            payable(msg.sender).transfer(msg.value - neededAmount);
        }
    }
}

// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

import {
    IERC20
} from "./interfaces/IERC20.sol";

contract EthParkQr is Owner {

    address ZERO_ADDRESS = address(0);
    address public NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    mapping(address => uint256) public orderCountByAddress;
    mapping(uint256 => mapping(address => OrderData)) public orderBalances;

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
        OrderData memory orderData = OrderData(
            token,
            bahtAmount,
            _baseUrl,
            _referenceString
        );

        _payQr(
            token,
            bahtAmount,
            _baseUrl,
            _referenceString
        );
    }

    function _payQr(
        address token,
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        internal
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
        string memory _baseUrl,
        string memory _referenceString,
        uint256 bahtAmount
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

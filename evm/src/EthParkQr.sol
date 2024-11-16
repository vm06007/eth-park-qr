// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

import {
    IERC20
} from "./interfaces/IERC20.sol";

import {
    IOracleHub
} from "./interfaces/IOracleHub.sol";

contract EthParkQr is Owner {

    address ZERO_ADDRESS = address(0);
    address public NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    mapping(address => uint256) public orderCountByAddress;
    mapping(uint256 => mapping(address => OrderData)) public orderBalances;

    constructor(
        address _oracleHubAddress
    )
    {
        ORACLE_HUB_INSTANCE = IOracleHub(
            _oracleHubAddress
        );
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
        OrderData memory orderData = OrderData(
            token,
            bahtAmount,
            _baseUrl,
            _referenceString
        );

        orderBalances[orderCountByAddress[msg.sender]][msg.sender] = orderData;

        _payQr(
            token,
            bahtAmount,
            _baseUrl,
            _referenceString
        );

        orderCountByAddress[msg.sender]++;
    }

    function _payQr(
        address token,
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        internal
    {
        uint256 getTokenAmountFromBaht = ORACLE_HUB_INSTANCE.getTokenAmount(
            token,
            bahtAmount
        );
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

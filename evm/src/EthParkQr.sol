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
    IOracleHub public immutable ORACLE_HUB_INSTANCE;

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
        _settleOrder(
            beneficiary,
            orderData,
            false
        );
    }

    function _settleOrder(
        address beneficiary,
        OrderData memory orderData,
        bool _isNative
    )
        internal
    {
        uint256 bahtAmount = orderData.bahtAmount;
        string memory _baseUrl = orderData.baseUrl;
        string memory _referenceString = orderData.referenceString;

        address actualAddress = _isNative ? NATIVE : orderData.token;

        uint256 neededAmount = ORACLE_HUB_INSTANCE.getTokenAmount(
            actualAddress,
            bahtAmount
        );
    }

    function settleOrderNative(
        address beneficiary,
        uint256 bahtAmount,
        OrderData memory orderData
    )
        onlyOwner
        external
    {
        _settleOrder(
            beneficiary,
            orderData,
            true
        );
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
        uint256 neededAmount = ORACLE_HUB_INSTANCE.getTokenAmount(
            NATIVE,
            bahtAmount
        );

        _payQr(
            NATIVE,
            bahtAmount,
            _baseUrl,
            _referenceString
        );

        if (msg.value > neededAmount) {
            payable(msg.sender).transfer(msg.value - neededAmount);
        }
    }
}

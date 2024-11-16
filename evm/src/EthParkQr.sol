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

error OnlyFriendlyBot();

contract EthParkQr is Owner {

    address ZERO_ADDRESS = address(0);
    address public NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    IOracleHub public immutable ORACLE_HUB_INSTANCE;

    struct Amounts {
        address tokenAddress;
        uint256 tokenAmountTotal;
        uint256 bahtAmountTotal;
        uint256 tokenAmountIssued;
    }

    struct OrderData {
        string baseUrl;
        string referenceString;
        address tokenAddress;
        address creator;
    }

    mapping(bytes32 => Amounts) public amountsFromOrder;
    mapping(address => bool) public friendlyBot;

    modifier onlyFriendlyBot() {
        _onlyFriendlyBot(
            msg.sender
        );
        _;
    }

    function _onlyFriendlyBot(
        address _address
    )
        private
    {
        require(
            friendlyBot[_address],
            OnlyFriendlyBot()
        );
    }

    constructor(
        address _oracleHubAddress
    )
    {
        ORACLE_HUB_INSTANCE = IOracleHub(
            _oracleHubAddress
        );
    }

    function getKeccack256(
        OrderData memory _orderData
    )
        public
        pure
        returns(bytes32)
    {
        return keccak256(
            abi.encodePacked(
                _orderData.baseUrl,
                _orderData.referenceString,
                _orderData.tokenAddress,
                _orderData.creator
            )
        );
    }

    function changeFriendlyBotStatus(
        address _botAddress,
        bool _status
    )
        onlyOwner
        external
    {
        friendlyBot[_botAddress] = _status;
    }

    receive()
    external
    payable {}

    function payQr(
        address _token,
        uint256 _bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        external
    {
        _payQr(
            _token,
            _bahtAmount,
            _baseUrl,
            _referenceString
        );

        uint256 actualTokenAmount = ORACLE_HUB_INSTANCE.getTokenEquivalent(
            _token,
            _bahtAmount
        );

        IERC20(_token).transferFrom(
            msg.sender,
            address(this),
            _payQr(
                _token,
                _bahtAmount,
                _baseUrl,
                _referenceString
            )
        );
    }

    function _payQr(
        address _token,
        uint256 bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        internal
        returns (uint256 tokenAmount)
    {
        OrderData memory orderData = OrderData(
            _baseUrl,
            _referenceString,
            _token,
            msg.sender
        );

        bytes32 orderDataHash = getKeccack256(
            orderData
        );

        Amounts storage data = amountsFromOrder[orderDataHash];

        tokenAmount = oracleHub.getTokenEquivalent(
            _token,
            _bahtAmount
        );

        data.tokenAddress = _token;
        data.tokenAmountTotal = data.tokenAmountTotal
            + actualTokenAmount;
        data.bahtAmountTotal = data.bahtAmountTotal
            + _bahtAmount;
    }

    function settleOrder(
        address beneficiary,
        OrderData memory orderData
    )
        onlyFriendlyBot
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

        address actualAddress = _isNative
            ? NATIVE
            : orderData.token;

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
        onlyFriendlyBot
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

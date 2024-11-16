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
error InsufficientFunds();
error OrderDoesntAlreadyExist();
error TokenMismatch(
    address expected,
    address actual
);
error AlreadyPaidInFull();

contract EthParkQr is Owner {

    event PaymentUpdated(
        address creator,
        string indexed baseUrl,
        string referenceString,
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 bahtAmount,
        bytes32 indexed orderDataHash
    );

    event OrderSettled(
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 indexed bahtAmount,
        bytes32 orderDataHash
    );

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
        view
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

    function getHash(
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

    function changeBotStatus(
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

    function payQR(
        address _token,
        uint256 _bahtAmount,
        string memory _baseUrl,
        string memory _referenceString
    )
        external
    {
        _payQR(
            _token,
            _bahtAmount,
            _baseUrl,
            _referenceString
        );

        IERC20(_token).transferFrom(
            msg.sender,
            address(this),
            _payQR(
                _token,
                _bahtAmount,
                _baseUrl,
                _referenceString
            )
        );
    }

    function _payQR(
        address _token,
        uint256 _bahtAmount,
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

        bytes32 orderDataHash = getHash(
            orderData
        );

        Amounts storage data = amountsFromOrder[orderDataHash];

        tokenAmount = ORACLE_HUB_INSTANCE.getTokenEquivalent(
            _token,
            _bahtAmount
        );

        data.tokenAddress = _token;
        data.tokenAmountTotal = data.tokenAmountTotal
            + tokenAmount;
        data.bahtAmountTotal = data.bahtAmountTotal
            + tokenAmount;

        emit PaymentUpdated(
            msg.sender,
            _baseUrl,
            _referenceString,
            _token,
            tokenAmount,
            _bahtAmount,
            orderDataHash
        );
    }

    function settleQROrder(
        address _beneficiary,
        bytes32 _orderDataHash
    )
        onlyFriendlyBot
        external
    {
        _settleQROrder(
            _beneficiary,
            _orderDataHash,
            false
        );
    }

    function _settleQROrder(
        address _beneficiary,
        bytes32 _orderDataHash,
        bool _isNative
    )
        internal
    {
        Amounts storage data = amountsFromOrder[_orderDataHash];

        require(
            data.tokenAddress != ZERO_ADDRESS,
            OrderDoesntAlreadyExist()
        );

        bool tokenMatches = _isNative == true
            ? data.tokenAddress == NATIVE
            : data.tokenAddress != NATIVE;

        require(
            tokenMatches,
            TokenMismatch(
                _isNative == true
                    ? NATIVE
                    : data.tokenAddress,
                data.tokenAddress
            )
        );

        require(
            data.tokenAmountIssued < data.tokenAmountTotal,
            AlreadyPaidInFull()
        );

        uint256 tokenAmountToIssue = data.tokenAmountTotal
         - data.tokenAmountIssued;

        data.tokenAmountIssued = data.tokenAmountIssued
            + tokenAmountToIssue;

        emit OrderSettled(
            data.tokenAddress,
            data.tokenAmountTotal,
            data.bahtAmountTotal,
            _orderDataHash
        );

        if (_isNative == true) {
            payable(_beneficiary).transfer(
                tokenAmountToIssue
            );

            return;
        }

        IERC20(data.tokenAddress).transfer(
            _beneficiary,
            tokenAmountToIssue
        );
    }

    function settleQROrderNative(
        address _beneficiary,
        bytes32 _orderDataHash
    )
        onlyFriendlyBot
        external
    {
        _settleQROrder(
            _beneficiary,
            _orderDataHash,
            true
        );
    }

    function payQRNative(
        string memory _baseUrl,
        string memory _referenceString,
        uint256 _bahtAmount
    )
        external
        payable
    {
        uint256 actualTokenAmount = ORACLE_HUB_INSTANCE.getTokenEquivalent(
            NATIVE,
            _bahtAmount
        );

        require(
            msg.value >= actualTokenAmount,
            InsufficientFunds()
        );

        _payQR(
            NATIVE,
            _bahtAmount,
            _baseUrl,
            _referenceString
        );

        if (msg.value > actualTokenAmount) {
            payable(msg.sender).transfer(
                msg.value - actualTokenAmount
            );
        }
    }
}

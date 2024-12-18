// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { OApp, Origin, MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { RoundInfoContract } from "./RoundInfoContract.sol";

contract MyOapp is OApp, RoundInfoContract {

    constructor(
        address _endpoint,
        address _owner
    )
    OApp(
        _endpoint,
        _owner
    )
    Ownable(
        _owner
    )
    {

    }

    RoundInfo public data;
    uint256 public lastInteraction;

    using OptionsBuilder for bytes;

    bytes public options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(
        50000,
        0
    );

    function addressToBytes32(
        address _addr
    )
        public
        pure
        returns (bytes32)
    {
        return bytes32(
            uint256(
                uint160(_addr)
            )
        );
    }

    function quote(
        uint32 _dstEid,
        bytes memory _message,
        bool _payInLzToken
    )
        public
        view
        returns (MessagingFee memory fee)
    {
        fee = _quote(
            _dstEid,
            _message,
            options,
            _payInLzToken
        );
    }

    function encodeRoundData(
        RoundInfo memory _data
    )
        public
        pure
        returns (bytes memory)
    {
        return abi.encode(
            _data
        );
    }

    function send(
        uint32 _dstEid,
        bytes memory _message,
        bytes calldata _options
    )
        external
        payable
    {
        _lzSend(
            _dstEid,
            _message,
            _options,
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );

        lastInteraction = block.timestamp;

        data = abi.decode(
            _message,
            (RoundInfo)
        );
    }

    function _lzReceive(
        Origin calldata,
        bytes32,
        bytes calldata payload,
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    )
        internal
        override
    {
        data = abi.decode(
            payload,
            (RoundInfo)
        );

        lastInteraction = block.timestamp;
    }
}
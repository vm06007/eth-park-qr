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
        string memory _message,
        bytes calldata _options
    ) external payable {
        // Encodes the message before invoking _lzSend.
        // Replace with whatever data you want to send!
        bytes memory _payload = abi.encode(_message);
        _lzSend(
            _dstEid,
            _payload,
            _options,
            // Fee in native gas and ZRO token.
            MessagingFee(msg.value, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );
    }

    /**
     * @dev Called when data is received from the protocol. It overrides the equivalent function in the parent contract.
     * Protocol messages are defined as packets, comprised of the following parameters.
     * @param _origin A struct containing information about where the packet came from.
     * @param _guid A global unique identifier for tracking the packet.
     * @param payload Encoded message.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    ) internal override {
        // Decode the payload to get the message
        // In this case, type is string, but depends on your encoding!
        data = abi.decode(payload, (string));
    }
}
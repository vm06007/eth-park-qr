// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

import {
    RoundInfoContract
} from "./RoundInfoContract.sol";

error OnlyFriendlyBot(
    address sender
);

contract MirroredOracle is Owner, RoundInfoContract {

    mapping(address => bool) friendlyBot;
    mapping(uint80 => RoundInfo) roundInfo;
    int256 public latestAnswer;

    uint80 public roundId;
    int256 public answer;
    uint256 public startedAt;
    uint256 public updatedAt;
    uint80 public answeredInRound;

    modifier onlyFriendlyBot() {
        _onlyFriendlyBot();
        _;
    }

    function _onlyFriendlyBot()
        internal
        view
    {
        require(
            friendlyBot[msg.sender],
            OnlyFriendlyBot(
                msg.sender
            )
        );
    }

    function changeBotStatus(
        address _botAddress,
        bool _status
    )
        external
        onlyOwner
    {
        friendlyBot[_botAddress] = _status;
    }

    function changeConfig(
        uint80 _roundId,
        RoundInfo memory _roundInfo
    )
        external
        onlyFriendlyBot
    {
        roundInfo[_roundId] = _roundInfo;
        latestAnswer = _roundInfo.answer;
    }

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (
            _returnRoundData(
                _roundId,
                roundInfo[_roundId]
            )
        );
    }

    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (
            _returnRoundData(
                roundId,
                roundInfo[roundId]
            )
        );
    }

    function _returnRoundData(
        uint80 _roundId,
        RoundInfo memory _roundInfo
    )
        private
        pure
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (
            _roundId,
            _roundInfo.answer,
            _roundInfo.startedAt,
            _roundInfo.updatedAt,
            _roundInfo.answeredInRound
        );
    }
}
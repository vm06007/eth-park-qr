// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {
    Owner
} from "./Owner.sol";

error OnlyFriendlyBot(
    address sender
);

contract MirroredOracle is Owner {

    struct RoundInfo {
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }

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

        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, 0, 0, 0, 0);
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, 0, 0, 0, 0);
    }
}
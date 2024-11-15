// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

contract MirroredOracle {
    address owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "OnlyOwner"
        );
        _;
    }

    function latestAnswer()
        external
        view
        returns (int256)
    {
        return 0;
    }

    function getRoundData()
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
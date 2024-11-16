// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

contract RoundInfoContract {
    struct RoundInfo {
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }

}
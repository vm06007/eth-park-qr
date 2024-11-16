// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MirroredOracle} from "../src/MirroredOracle.sol";
import "../src/layer0Std.sol";
import {RoundInfoContract} from "../src/RoundInfoContract.sol";

contract MirrorOracleUpdateScript is Script {
    MirroredOracle public mirroredOracle;
    MyOapp public myOapp;

    function setUp()
        public
    {}

    function run()
        public
    {
        vm.startBroadcast(
            uint256(
                vm.envBytes32("PRIVATE_KEY")
            )
        );

        mirroredOracle = MirroredOracle(
            vm.envAddress("MIRROR_ORACLE_ADDRESS")
        );

        myOapp = MyOapp(
            vm.envAddress("MY_OAPP_ARBITRUM")
        );

        (
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = myOapp.data();

        RoundInfoContract.RoundInfo memory roundInfo = RoundInfoContract.RoundInfo({
            answer: answer,
            startedAt: startedAt,
            updatedAt: updatedAt,
            answeredInRound: answeredInRound
        });

        int256 currentAnswer = mirroredOracle.latestAnswer();

        console.log(
            "Current Answer: ",
            currentAnswer
        );

        console.log(
            "Round Info: ",
            roundInfo.answer
        );

        if (currentAnswer != roundInfo.answer) {
            mirroredOracle.changeConfig(
                roundInfo.answeredInRound,
                roundInfo
            );
        }
    }
}
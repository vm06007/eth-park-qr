// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MirroredOracle} from "../src/MirroredOracle.sol";
import "../src/layer0Std.sol";
import {AggregatorV3Interface} from "../src/Interfaces/AggregatorV3Interface.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {RoundInfoContract} from "../src/RoundInfoContract.sol";

contract SendMirrorOracleMessageScript is Script {
    address MY_OAPP_POLYGON = vm.envAddress("MY_OAPP_POLYGON");
    MyOapp public myOapp;
    MirroredOracle public mirroredOracle;

    address THBFEED = 0x5164Ad28fb12a5e55946090Ec3eE1B748AFb3785;
    address public newOracleAddress;

    using OptionsBuilder for bytes;
    bytes public options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(
        200000,
        0
    );

    function setUp()
        public
    {
        mirroredOracle = MirroredOracle(
            THBFEED
        );

        myOapp = MyOapp(
            MY_OAPP_POLYGON
        );

        require(
            address(mirroredOracle) != address(0),
            "MirroredOracle not set"
        );

        require(
            address(myOapp) != address(0),
            "MyOapp not set"
        );
    }

    function run()
        public
    {
        vm.startBroadcast(
            uint256(
                vm.envBytes32("PRIVATE_KEY")
            )
        );

        mirroredOracle = MirroredOracle(
            THBFEED
        );

        (
            ,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = mirroredOracle.latestRoundData();

        (
            int256 answerOapp,
            ,
            ,
        ) = myOapp.data();

        RoundInfoContract.RoundInfo memory roundInfo = RoundInfoContract.RoundInfo({
            answer: answer,
            startedAt: startedAt,
            updatedAt: updatedAt,
            answeredInRound: answeredInRound
        });

        if (answerOapp != answer) {

            console.log(
                "answerOapp: ",
                answerOapp
            );

            console.log(
                "answer: ",
                answer
            );

            uint32 eid = uint32(
                vm.envUint(
                    "EID_ARBITRUM"
                )
            );

            bytes memory message = abi.encode(
                roundInfo
            );

            MessagingFee memory fee = myOapp.quote(
                eid,
                message,
                false
            );

            myOapp.send{
                value: fee.nativeFee * 4
            }(
                eid,
                message,
                options
            );
        }
    }
}
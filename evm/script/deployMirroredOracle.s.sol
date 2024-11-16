// SPDX-License-Identifier: MIT
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MirroredOracle} from "../src/MirroredOracle.sol";

contract deployMirroredOracleScript is Script {
    MirroredOracle public mirroredOracle;

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

        mirroredOracle = new MirroredOracle();

        console.log(
            "MirroredOracle deployed at address: ",
            address(mirroredOracle)
        );
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EthParkQr} from "../src/EthParkQr.sol";

contract EthParkQrScript is Script {
    EthParkQr public ethParkQr;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

       // ethParkQr = new EthParkQr();

        vm.stopBroadcast();
    }
}

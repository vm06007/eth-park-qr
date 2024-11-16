// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EthParkQr} from "../src/EthParkQr.sol";
import {OracleHub} from "../src/OracleHub.sol";

contract EthParkQrScript is Script {
    EthParkQr public ethParkQr;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

       // ethParkQr = new EthParkQr();

        vm.stopBroadcast();
    }
}

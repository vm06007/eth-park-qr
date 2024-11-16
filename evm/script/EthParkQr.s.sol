// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EthParkQr} from "../src/EthParkQr.sol";
import {OracleHub} from "../src/OracleHub.sol";

contract DeployOracleHub is Script {
    OracleHub public oracleHub;
    address THBFEED = block.chainid == 137
        ? vm.envAddress("TBH_FEED_POLYGON")
        : vm.envAddress("TBH_FEED_ARBITRUM");

    address USDCFEED = block.chainid == 137
        ? vm.envAddress("USDC_FEED_POLYGON")
        : vm.envAddress("USDC_FEED_ARBITRUM");

    address USDC_ADDRESS = block.chainid == 137
        ? vm.envAddress("USDC_ADDRESS_POLYGON")
        : vm.envAddress("USDC_ADDRESS_ARBITRUM");

    address WETH_POLYGON = block.chainid == 137
        ? vm.envAddress("WETH_ADDRESS_POLYGON")
        : vm.envAddress("WETH_ADDRESS_ARBITRUM");

    address WETH_FEED = block.chainid == 137
        ? vm.envAddress("WETH_FEED_POLYGON")
        : vm.envAddress("WETH_FEED_ARBITRUM");

    address NATIVE_FEED = block.chainid == 137
        ? vm.envAddress("POL_FEED_POLYGON")
        : vm.envAddress("WETH_FEED_ARBITRUM");

    address public NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(
            uint256(
                vm.envBytes32("PRIVATE_KEY")
            )
        );

        oracleHub = new OracleHub(
            THBFEED
        );

        console.log(
            "OracleHub deployed at address: ",
            address(oracleHub)
        );

        oracleHub.setTokenPriceFeed(
            USDC_ADDRESS,
            USDCFEED
        );

        oracleHub.setTokenPriceFeed(
            NATIVE,
            NATIVE_FEED
        );
    }
}

contract EthParkQrScript is Script {
    EthParkQr public ethParkQr;
    address ORACLE_HUB_DEPLOYED = block.chainid == 137
        ? vm.envAddress("ORACLE_HUB_DEPLOYED_POLYGON")
        : vm.envAddress("ORACLE_HUB_DEPLOYED_ARBITRUM");

    function setUp() public {}

    function run() public {
        vm.startBroadcast(
            uint256(
                vm.envBytes32("PRIVATE_KEY")
            )
        );

        ethParkQr = new EthParkQr(
            ORACLE_HUB_DEPLOYED
        );

        console.log(
            "EthParkQr deployed at address: ",
            address(ethParkQr)
        );

        ethParkQr.changeBotStatus(
            ethParkQr.owner(),
            true
        );

        console.log(
            "Friendly bot added: ",
            ethParkQr.owner()
        );
        vm.stopBroadcast();
    }
}

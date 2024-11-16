// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {EthParkQr} from "../src/EthParkQr.sol";
import {OracleHub} from "../src/OracleHub.sol";

contract DeployOracleHub is Script {
    OracleHub public oracleHub;
    address THBFEED = 0x5164Ad28fb12a5e55946090Ec3eE1B748AFb3785;
    address USDCFEED = 0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7;
    address USDC_ADDRESS = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address WETH_POLYGON = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
    address WETH_POLYGON_FEED = 0xF9680D99D6C9589e2a93a78A04A279e509205945;
    address NATIVE_FEED = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
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

    function setUp() public {}

    function run() public {
        vm.startBroadcast();



        vm.stopBroadcast();
    }
}

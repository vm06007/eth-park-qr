// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {MyOapp} from "../src/layer0Std.sol";

contract setLayer0Peers is Script {
    MyOapp public myOapp;
    address endPoint;
    address deployer = 0xEF034b79E30c21fBabab836b34f4b3ae3e0130a8;

    function setUp()
        public
    {

    }

    function run()
       public
    {
        vm.startBroadcast(
            uint256(
                vm.envBytes32("PRIVATE_KEY")
            )
        );

        address OAP_ARBITRUM = vm.envAddress(
            "MY_OAPP_ARBITRUM"
        );

        address OAP_POLYGON = vm.envAddress(
            "MY_OAPP_POLYGON"
        );

        address peer = block.chainid == 137
            ? OAP_ARBITRUM
            : OAP_POLYGON;

        myOapp = block.chainid == 137
            ? MyOapp(
                OAP_POLYGON
            )
            : MyOapp(
                OAP_ARBITRUM
            );

        uint32 eid = block.chainid == 137
            ? 30110
            : 30109;

        myOapp.setPeer(
            eid,
            myOapp.addressToBytes32(
                peer
            )
        );
    }
}
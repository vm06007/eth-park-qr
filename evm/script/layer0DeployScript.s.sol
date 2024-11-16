// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {MyOapp} from "../src/layer0Std.sol";

contract layer0DeployScript is Script {
    MyOapp public myOapp;
    address endPoint;
    address deployer = vm.envAddress("DEPLOYER");

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

        endPoint = vm.envAddress("ENDPOINT");

        require(
            endPoint != address(0),
            "ENDPOINT not set"
        );

        myOapp = new MyOapp(
            endPoint,
            deployer
        );

        console.log(
            "MyOapp deployed at address: ",
            address(myOapp)
        );
    }
}
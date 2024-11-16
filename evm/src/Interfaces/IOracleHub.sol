// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

interface IOracleHub {
    function getTokenAmount(
        address tokenAddress,
        uint256 bahtAmount
    )
        external
        returns (uint256);

    function getBahtAmount(
        address tokenAddress,
        uint256 tokenAmount
    )
        external
        returns (uint256);
}
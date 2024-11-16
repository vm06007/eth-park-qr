// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

interface IOracleHub {
    function getTokenEquivalent(
        address tokenAddress,
        uint256 bahtAmount
    )
        external
        returns (uint256);

    function getBahtEquivalent(
        address tokenAddress,
        uint256 tokenAmount
    )
        external
        returns (uint256);
}
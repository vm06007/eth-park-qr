// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

interface IERC20 {
    function transfer(
        address to,
        uint256 value
    )
        external
        returns (bool);

    function balanceOf(
        address who
    )
        external
        view
        returns (uint256);

    function allowance(
        address owner,
        address spender
    )
        external
        view
        returns (uint256);

    function approve(
        address spender,
        uint256 value
    )
        external
        returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    )
        external
        returns (bool);

    function decimals()
        external
        view
        returns (uint8);
}
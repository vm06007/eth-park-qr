// SPDX-License-Identifier: BKK
pragma solidity =0.8.28;

contract EventTesterBot {

    uint256 storageValue;

    event EventTest(
        address indexed sender,
        uint256 indexed value
    );

    function changeStorage(
        uint256 _value
    )
        external
    {
        storageValue = _value;
    }

    function emitEvent(
        uint256 _someValue
    )
        external
    {
        emit EventTest(
            msg.sender,
            _someValue
        );
    }
}
//SPDX-License-Identifier: mit
pragma solidity = 0.7.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Porridge is ERC20 {

    uint8 private constant TOKEN_DECIMALS = 18;
    uint private constant TOTAL_SUPPLY = 1000 * (10 ** TOKEN_DECIMALS);

    constructor() ERC20("Porridge", 'PORR') {
        _setupDecimals(TOKEN_DECIMALS);
    }
}
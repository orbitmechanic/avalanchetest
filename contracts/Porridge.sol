pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Porridge is ERC20 {

    uint8 private constant TOKEN_DECIMALS = 18;
    uint private constant TOTAL_SUPPLY = 1000 * (10 ** TOKEN_DECIMALS);

    constructor() ERC20("Porridge", 'PORR') {
        _setupDecimals(TOKEN_DECIMALS);
    }

    /** 
     *  TODO: Needs role restriction.
     */
    function mint(address account, uint amount) public {
        _mint(account, amount * (10 ** TOKEN_DECIMALS));
    }

    function burn(address account, uint amount) public {
        _burn(account, amount * (10 ** TOKEN_DECIMALS));
    }
}
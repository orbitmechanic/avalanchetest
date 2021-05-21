pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Peas is ERC20 {

    uint8 private constant TOKEN_DECIMALS = 18;

    constructor(string memory token_name, string memory token_symbol, uint premint) 
        ERC20(token_name, token_symbol) {
        _setupDecimals(TOKEN_DECIMALS);
        _mint(msg.sender, premint * (10 ** TOKEN_DECIMALS));
    }

    /** Create some tokens and assign them to an account.
        Unrestricted use for ease of Wrapper swapping.
     */
    function mint(address account, uint amount) public {
        _mint(account, amount * (10 ** TOKEN_DECIMALS));
    }

    function burn(address account, uint amount) public {
        _burn(account, amount * (10 ** TOKEN_DECIMALS));
    }
}
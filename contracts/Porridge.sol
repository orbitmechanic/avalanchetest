pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Porridge is ERC20, AccessControl {

    uint8 private constant TOKEN_DECIMALS = 18;

    // Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address licensee) ERC20("Porridge", 'PORR') {
        _setupDecimals(TOKEN_DECIMALS);
        // Grant the minter role to a specified account
        _setupRole(MINTER_ROLE, licensee);
    }

    function mint(address account, uint amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter.");
        _mint(account, amount * (10 ** TOKEN_DECIMALS));
    }

    function burn(address account, uint amount) public {
        _burn(account, amount * (10 ** TOKEN_DECIMALS));
    }
}
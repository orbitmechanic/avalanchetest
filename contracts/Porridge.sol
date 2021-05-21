pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Porridge
/// @author Bob Clark
/// @notice Slightly permissioned ERC20 token contract
/// @dev Only problem-specified permissions were implemented.

contract Porridge is ERC20, AccessControl {

    uint8 private constant TOKEN_DECIMALS = 18;

    /// @dev Create a new role identifier for the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Porridge", 'PORR') {
        _setupDecimals(TOKEN_DECIMALS);
    }

    /// @notice Grants the minter role to a specified account
    /// @dev Warning: permissionless.  Not for production use.
    /// @param minter address to be licensed to mint
    function setMinter(address minter) public {
        _setupRole(MINTER_ROLE, minter);
    }  

    /// @notice Create tokens from null address.
    /// @notice Sender must have MINTER_ROLE to do this.
    /// @param account address to mint tokens to
    /// @param amount of tokens to mint.
    function mint(address account, uint amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter.");
        _mint(account, amount * (10 ** TOKEN_DECIMALS));
    }

    /// @notice Transfer tokens back to null address.
    /// @dev Warning: permissionless.  Not for production use.
    /// @param account from which to transfer tokens
    /// @param amount of tokens to tranfer.
    function burn(address account, uint amount) public {
        _burn(account, amount * (10 ** TOKEN_DECIMALS));
    }


}
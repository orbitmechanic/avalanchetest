pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Peas
/// @author Bob Clark
/// @notice Permissionless ERC20 Contract
/// @dev No permissions are implemented.
contract Peas is ERC20 {

    uint8 private constant TOKEN_DECIMALS = 18;

    /// @dev contract pre-mints tokens for convienience
    constructor(string memory token_name, string memory token_symbol, uint premint) 
        ERC20(token_name, token_symbol) {
        _setupDecimals(TOKEN_DECIMALS);
        _mint(msg.sender, premint * (10 ** TOKEN_DECIMALS));
    }

    /// @notice Create tokens from null address.
    /// @dev Warning: permissionless.  Not for production use.
    /// @param account address to mint tokens to
    /// @param amount of tokens to mint.
    function mint(address account, uint amount) public {
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
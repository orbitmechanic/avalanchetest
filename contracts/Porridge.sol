pragma solidity = 0.7.4;
//SPDX-License-Identifier: mit

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title Porridge
/// @author Bob Clark
/// @notice A mostly permissioned ERC20 token contract
/// @dev Only problem-specified permissions were implemented.

contract Porridge is ERC20, AccessControl {

    uint8 private constant TOKEN_DECIMALS = 18;

    /// @dev Create a new role identifier for the minter role
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Porridge", 'PORR') {
        _setupDecimals(TOKEN_DECIMALS);
        _setupRole(OWNER_ROLE, msg.sender);
        _setRoleAdmin(MINTER_ROLE, OWNER_ROLE);
    }

    function setMinter(address account) public {
        require(hasRole(OWNER_ROLE, msg.sender), 'caller is not an owner.');
        _setupRole(MINTER_ROLE, account);
    }

    /// @notice Create tokens from null address.
    /// @notice Sender must have MINTER_ROLE to do this.
    /// @param account address to mint tokens to
    /// @param amount of tokens to mint.
    function mint(address account, uint amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), 'caller is not a minter.');
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
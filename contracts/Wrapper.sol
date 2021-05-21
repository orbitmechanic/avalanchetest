pragma solidity 0.7.4;

// SPDX-License-Identifier: UNLICENSED

/// @dev works for both Peas and Porridge contracts:
abstract contract PotInterface {
    function balanceOf(address) public virtual returns(uint);
    function mint(address, uint) public virtual;
    function burn(address, uint) public virtual;
}

/// @title Wrapper 
/// @author Bob Clark 
/// @notice for swapping specific ERC20 tokens, A | B <--> C, 1:1
/// @dev For academic use only
contract Wrapper {

    address Hot; // Address of Peas token "Hot"
    address Cold; // Address of Peas token "Cold"
    address Porridge; // Address of "Porridge" token
    PotInterface porridge; // Porridge contract interface.

    /// @notice Records addresses of affected tokens
    /// @param Hot_ address of Peas contract "Hot" token
    /// @param Cold_ address of Peas contract "Cold" token
    /// @param Porridge_ address of Porridge contract token
    constructor(address Hot_, address Cold_, address Porridge_) {
        Hot = Hot_; Cold = Cold_; Porridge = Porridge_;
        porridge = PotInterface(Porridge);
    }

    /// @notice Swap Hot or Cold Peas for an equal amount of Porridge.
    /// @param peas_ address of Hot or Cold Peas token to swap
    /// @param amount amount of 1:1 Porridge token to receive
    function swap(address peas_, uint amount) external {
        // Checks
        require(peas_ == Hot || peas_ == Cold, "lukewarm peas.");
        PotInterface peas = PotInterface(peas_);
        require(peas.balanceOf(msg.sender) >= amount, 
            'insufficient peas.');
        // Effects
        peas.burn(msg.sender, amount);
        // Interactions
        porridge.mint(msg.sender, amount);
    }

    /// @notice Swap Porridge for an equal amount of Hot or Cold Peas.
    /// @param peas_ address of Hot or Cold Peas token to receive
    /// @param amount amount of 1:1 Porridge token to swap
    function unswap(address peas_, uint amount) external  {
        // Checks
        require(peas_ == Hot || peas_ == Cold, "lukewarm peas.");
        require(porridge.balanceOf(msg.sender) >= amount, 
            'insufficient porridge.');
        // Effects
        porridge.burn(msg.sender, amount);
        // Interactions
        PotInterface peas= PotInterface(peas_);
        peas.mint(msg.sender, amount);
    }
}

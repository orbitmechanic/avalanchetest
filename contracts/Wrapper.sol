pragma solidity 0.7.4;

// SPDX-License-Identifier: UNLICENSED

/// @title Wrapper 
/// @author Bob Clark 
/// @notice for swapping specific ERC20 tokens, A | B <--> C, 1:1
/// @dev For academic use only
contract Wrapper {

    address A; // Address of A token
    address B; // Address of B token
    address C; // Address of C token

    /// @notice Records addresses of affected tokens
    /// @param A_ address of A token contract
    /// @param B_ address of B token contract
    /// @param C_ address of C token contract
    constructor(address A_, address B_, address C_) {
        A = A_; B = B_; C = C_;
    }

    /// @notice Swap A | B for an equal amount of C.
    /// @param token_ address of A | B token to swap
    /// @param amount amount of 1:1 C token to receive
    function swap(address token_, uint amount) external {
        // Checks
        require(token_ == A || token_ = B, 'unknown input token.');
        require(token_.balanceOf(msg.sender) >= amount, 
            'insufficient input tokens');
        // Effects
        token_.burn(msg.sender, amount);
        // Interactions
        C.mint(amount);
    }

    /// @notice Swap C for an equal amount of A | B.
    /// @param token_ address of A | B token to receive
    /// @param amount amount of 1:1 C token to swap
    function unswap(address token_, uint amount) external {
        // Checks
        require(token_ == A || token_ = B, 'unknown output token.');
        require(C.balanceOf(msg.sender) >= amount, 
            'insufficient input tokens');
        // Effects
        C.burn(msg.sender, amount);
        // Interacdtions
        token_.mint(amount);
    }
}

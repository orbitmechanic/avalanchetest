pragma solidity 0.7.4;

// SPDX-License-Identifier: UNLICENSED

contract Wrapper {

    address A; // Address of A token
    address B; // Address of B token
    address C; // Address of C token

    /* 
     * Record addresses of affected tokens
     * @param A_ address of A token contract
     * @param B_ address of B token contract
     * @param C_ address of C token contract
     */
    constructor(address A_, address B_, address C_) {
        //require(A_ )
    }

    /**
     * Convert an amount of input token_ to an equivalent amount of the output token
     *
     * @param token_ address of token to swap
     * @param amount amount of token to swap/receive
     */
    function swap(address token_, uint amount) external {

    }

    /**
     * Convert an amount of the output token to an equivalent amount of input token_
     *
     * @param token_ address of token to receive
     * @param amount amount of token to swap/receive
     */
    function unswap(address token_, uint amount) external {

    }
}

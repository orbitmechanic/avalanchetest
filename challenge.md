# Multitoken Wrapping

The challenge is to create a token swapping Solidity smart contract and deploy it on Avalanche. The user should be able to swap either of two ERC20s for a single ERC20 token. For example, you can swap token A or token B for token C. Swaps should also be possible in the reverse direction.Token C should be redeemable for token A or token B. Token exchange rates are one-to-one. Input side ERC20 tokens do not need to swappable for each other. You do not need a method to swap token A for token B.

A || B <==> C

## Provided Stub
Attached is a Solidity stub for the Wrapper contract. It contains two methods: `function swap(address token_, uint amount)` and `function unswap(address token_, uint amount)`. Please implement these methods. Feel free to add whatever other methods and contracts are necessary.

## Token Parameters

Please give each token its own unique name and symbol. Do not name them tokens A, B, and C. Tokens may all have the same number of decimals.

### Token Minting

Tokens A and B should be minted outside of wrapper contract. The wrapper contract should not be able to mint any new A or B tokens. Token C, however, should be minted exclusively from inside the Wrapper contract.

## External resources

Feel free to use any code from OpenZeppelin. You may import their contracts into your own or deploy theirs without modifications. Please refrain from using code from any other source.

## Development Environment

You may use any deployment environment you choose. We recommend you use our preconfigured Hardhat environment, but we've also developed configurations for several other platforms. You may use any version of Solidity >= 0.5.0.

- Hardhat: https://github.com/ava-labs/avalanche-smart-contract-quickstart
- Truffle: https://docs.avax.network/build/tutorials/smart-contracts/using-truffle-with-the-avalanche-c-chain
- Remix: https://docs.avax.network/build/tutorials/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask

## Deploying on Fuji

Avalanche is a multi-blockchain ecosystem. Our first class chains are currently the X-Chain, P-Chain, and C-Chain. For this challenge, you'll be deploying your smart contract on the C-Chain. Feel free to ignore any documentation related to other chains. Please deploy all contracts on our Fuji testnet.

### Getting AVAX

To deploy on our Fuji testnet, you'll need Fuji AVAX. Go ahead and get some from our web faucet: https://faucet.avax-test.network/.

## Deliverables
1. Source code for your deployed Wrapper contract, tokens A, B, C, and any other contracts you deploy as part of your solution.
( see zip archive )

2. The Fuji deployment address of each contract delivered in 1.
        'Hot' deployed to: 0xB2ef4aB171cdb95EA695525718EA2f82CE4D3FD8
        'Cold' deployed to: 0xb8b1F3c2511fEf68C39e9C6117F7ed70106D8717
    'Porridge' deployed to: 0xf0226c5238de743F1879a280DF62cFA709B416bA
    'Wrapper' deployed to: 0x2aD5FF1Bb3B67ce81D2a79e8cDCF79E223E3c2f5

3. A pseudocode call sequence for the correct order and arguments to deploy all contracts and swap 100 token A for token C, then convert 50 token C to token B.
    ### My call sequence:
    1. Deploy 'Hot' instance of 'Peas' contract...with a 1000 token pre-mint.
    2. Deploy 'Cold' instance of 'Peas' contract...with a 1000 token pre-mint.
    3. Deploy single instance of 'Porridge' contract.
    4. Deploy 'Wrapper' contract given deployed addresses of 'Hot', 'Cold', and 'Porridge'.
    5. Grant 'Wrapper' MINTER_ROLE within 'Porridge'.
    6. Call Wrapper.swap() with 'Hot' address to exchange 100 'Hot' tokens for 100 'Porridge' tokens.
    7. Call Wrapper.unswap() with 'Cold' address to exchange 50 'Porridge' tokens for 50 'Cold' tokens.

4. Transfer 1000 of token A and token B to Fuji address 0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd.

Log of live Fuji deployment script as follows
(did not cheat by granting owner minting role in 'Porridge'.  Did it the 'right' way.):

    quickstart [main●] % yarn deploy --network fuji
    ...
    Deploying contracts with the account: 0x245144A7124601aE4c6d0078A431fB9d0576b143
    Account balance: 20000000000000000000
    'Hot' deployed to:  0xB2ef4aB171cdb95EA695525718EA2f82CE4D3FD8
    'Cold' deployed to: 0xb8b1F3c2511fEf68C39e9C6117F7ed70106D8717
    'Porridge' deployed to: 0xf0226c5238de743F1879a280DF62cFA709B416bA
    'Wrapper' deployed to: 0x2aD5FF1Bb3B67ce81D2a79e8cDCF79E223E3c2f5
    'Wrapper' set to 'Porridge' minter.
    500 'Hot' converted to 500 'Porridge'
    500 'Cold' converted to 500 'Porridge'
    1000 'Porridge' transfered to TEACHER_ADDRESS.
    TEACHER_ADDRESS:0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd
    End of challenge.
    ✨  Done in 59.71s.
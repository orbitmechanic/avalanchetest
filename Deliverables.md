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
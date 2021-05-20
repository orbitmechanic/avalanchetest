// test/Airdrop.js
// Load dependencies
const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const Web3 = require('web3');

const OWNER_ADDRESS = ethers.utils.getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

const DECIMALS = 18; // Tokens may all have the same number of decimals.
const PREMINT = 100; // Amount to pre-mint of A and B.

///////////////////////////////////////////////////////////
// SEE https://hardhat.org/tutorial/testing-contracts.html
// FOR HELP WRITING TESTS
// USE https://github.com/gnosis/mock-contract FOR HELP
// WITH MOCK CONTRACT
///////////////////////////////////////////////////////////

// In the pot...
describe('9DaysOld', function () {

    // Presumptions: openZeppelin coded a reliable ERC20 contract.
    // Only test new coding challenge behavior requirements here.

    // Create contract factories once.
    before(async function () {
        // {Token A: 'Hot', Token B: 'Cold'} are both Peas.
        this.InputToken = await ethers.getContractFactory("Peas");
    });

    // Test token A|B
    describe("Input token", function () {

        // Refresh contracts per test case.
        beforeEach(async function () {
            this.inputToken = await this.InputToken.deploy('Input','INP', PREMINT);
            await this.inputToken.deployed();
        });

        // Please give each token its own unique name ...
        // Do not name them tokens A ...
        it("is called 'Input'.", async function () {
            const inputTokenName = await this.inputToken.name();
            expect(inputTokenName).to.equal('Input');
        });

        // Please give each token its own unique symbol
        it("has a 'INP' symbol.", async function () {
            const inputTokenSymbol = await this.inputToken.symbol();
            expect(inputTokenSymbol).to.equal('INP');
        });

        // Tokens may all have the same number of decimals.
        it('is correctly decimated.', async function () {
            const inputTokenDecimation = await this.inputToken.decimals();
            expect(inputTokenDecimation).to.equal(DECIMALS);
        });

        // Token A should be minted outside the wrapper contract.
        // Simplest solution: mint Hot in its construtor.
        // Hot should have a non-zero supply on construction.
        it('was pre-minted.', async function () {
            const inputTokenDecimation = await this.inputToken.decimals();
            const decimationBase = BigNumber.from(10);
            const inputTokenUnit = decimationBase.pow(inputTokenDecimation);
            const inputTokenTotalSupply = BigNumber.from(await this.inputToken.totalSupply());
            const inputTokenTotalTokens = inputTokenTotalSupply.div(inputTokenUnit);
            expect(inputTokenTotalTokens.eq(PREMINT)).to.equal(true);
        });

        // Token A should be minted outside the wrapper contract.
        // Ensure mint function can be called externally (ownerOnly)
        it("can be minted outside the Wrapper contract.", async function () {
            expect((await this.inputToken.mint({ value: 100 }))).to.equal(100);
        })
    });

    // Test token C.
    describe("Output token", function () {

        // Create contract factories once.
        before(async function () {
            // {Token A: 'Hot', Token B: 'Cold'} are both Peas.
            this.OutputToken = await ethers.getContractFactory("Porridge");
        });

        // Refresh contracts per test case.
        beforeEach(async function () {
            this.outputToken = await this.OutputToken.deploy();
            await this.outputToken.deployed();
        });

        // Please give each token its own unique name ...
        // Do not name them tokens ... and C
        it("is called 'Porridge'.", async function () {
            const outputTokenName = await this.outputToken.name();
            expect(outputTokenName).to.equal('Porridge');
        });

        // Please give each token its own unique symbol
        it("has a 'PORR' symbol", async function () {
            const outputTokenSymbol = await this.outputToken.symbol();
            expect(outputTokenSymbol).to.equal('PORR');
        });

        // Tokens may all have the same number of decimals.
        it('is correctly decimated.', async function () {
            const outputTokenDecimation = await this.outputToken.decimals();
            expect(outputTokenDecimation).to.equal(DECIMALS);
        });

        // ...should be minted exclusively from inside the Wrapper contract.
        // (So it can't have any supply on construction.)
        it("wasn't pre-minted.", async function () {
            const outputTokenTotalSupply = await this.outputToken.totalSupply();
            expect(outputTokenTotalSupply).to.equal(0x0);
        });

        // Token C ... should be minted exclusively from inside the wrapper contract.
        // Ensure mint function cannot be "cold-called".
        it("cannot be minted outside the Wrapper contract.", async function () {
            expect((await this.outputToken.mint({ value: 100 }))).to.be.reverted;
        })
    });

    // Test Wrapper contract (not an ERC20).
    // All token exchange rates are one-to-one.
    describe("Swapping Wrapper", function () {

        // Non-Tests:
        // Input side ERC20 tokens do not need to swappable for each other.
        // You do not need a method to swap token A for token B.
        // (This is not a hard requirement that there shouldn't be A<->B swap.
        // But no requirement exists for this so no feature will be coded/tested.)

        // Create contract factories once.
        before(async function () {
            // {Token A: 'Hot', Token B: 'Cold'} are both Peas.
            this.InputToken = await ethers.getContractFactory("Peas");
            this.OutputToken = await ethers.getContractFactory("Porridge");
            this.Wrapper = await ethers.getContractFactory('Wrapper');
        });

        // Refresh contracts per test case.
        beforeEach(async function () {
            this.hot = await this.InputToken.deploy('Hot','HOT', PREMINT);
            await this.hot.deployed();
            this.cold = await this.InputToken.deploy('Cold','COLD',PREMINT);
            await this.cold.deployed();
            this.porridge = await this.OutputToken.deploy();
            await this.porridge.deployed();
            this.wrapper = await this.Wrapper.deploy(
                this.hot.address,
                this.cold.address, 
                this.porridge.address);
            await this.wrapper.deployed();
        });

        // Can swap token A for token C
        describe("Can swap 'Hot' for 'Porridge'.", function () {
            
            // Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when swapping.", async function () {
                expect((await this.wrapper.swap({token_: this.hot.address, amount:3}))
                    .to.emit(this.wrapper,"swapped")
                    .withArgs('Hot',3));
            });

            // Token C ... should be minted ... from inside the Wrapper contract.
            // Can swap token A for token C
            it("mints 'Porridge' from 'Hot'.", async function () {
                await this.wrapper.swap({token_: this.hot.address, amount:3});
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal(3);
            });

            // Can swap token A for token C
            it("burns 'Hot' while minting 'Porridge'.", async function () {
                await this.wrapper.swap({token_: this.hot.address, amount:3});
                const hotTotalSupply = await this.hot.totalSupply();
                expect(hotTotalSupply).to.equal(PREMINT - 3);
            });

            // Can't swap more token A than in balance.
            it("won't underrun 'Hot'.", async function () {
                expect(await this.wrapper.swap({token_: this.hot.address, amount:101}))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning C doesn't seem plausible for this challenges' use cases.

        });

        // Can swap token B for token C
        describe("Can swap 'Cold' for 'Porridge'.", function () {

            // Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when swapping.", async function () {
                expect((await this.wrapper.swap({token_: this.cold.address, amount:3}))
                    .to.emit(this.wrapper,"swapped")
                    .withArgs('Cold',3));
            });

            // Token C ... should be minted ... from inside the Wrapper contract.
            // Can swap token B for token C
            it("mints 'Porridge' from 'Cold'.", async function () {
                await this.wrapper.swap({token_: this.cold.address, amount:3});
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal(3);
            });

            // Can swap token A for token C
            it("burns 'Cold' while minting 'Porridge'.", async function () {
                await this.wrapper.swap({token_: this.cold.address, amount:3});
                const coldTotalSupply = await this.cold.totalSupply();
                expect(coldTotalSupply).to.equal(PREMINT - 3);
            });

            // Can't swap more token B than in balance.
            it("won't underrun 'Cold'.", async function () {
                expect(await this.wrapper.swap({token_: this.cold.address, amount:101}))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning C doesn't seem plausible for this challenges' use cases.
        });
        
        // Swaps should also be possible in the reverse direction.
        describe("Can un-swap 'Porridge' for 'Hot'.", function () {

            // Need to pre-load token C for testing (from token A)
            beforeEach(async function () {
                await this.wrapper.swap({token_: this.hot.address, amount:PREMINT});
            })
            
            // Un-Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when unswapping.", async function () {
                expect((await this.wrapper.unswap({token_: this.hot.address, amount:3}))
                    .to.emit(this.wrapper,"unswapped")
                    .withArgs('Hot',3));
            });

            // Can unswap token C for token A
            it("mints 'Hot' from 'Porridge'.", async function () {
                await this.wrapper.unswap({token_: this.hot.address, amount:3});
                const hotTotalSupply = await this.hot.totalSupply();
                expect(hotTotalSupply).to.equal(3);
            });

            // Token C ... should be burned ... from inside the Wrapper contract.
            // Can swap token A for token C
            it("burns 'Porridge' while minting 'Hot'.", async function () {
                await this.wrapper.unswap({token_: this.hot.address, amount:3});
                const porridgeTotalSupply = await this.porridge.totalSupply()
                expect(porridgeTotalSupply).to.equal(PREMINT - 3);
            });

            // Can't swap more token A than in balance.
            it("won't underrun 'Porridge' to mint 'Hot'.", async function () {
                expect(await this.wrapper.unswap({token_: this.hot.address, amount:101}))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning A doesn't seem plausible for this challenges' use cases.

        });
 
        // Swaps should also be possible in the reverse direction.
        describe("Can un-swap 'Porridge' for 'Cold'.", function () {

            // Need to pre-load token C for testing (from token B)
            beforeEach(async function () {
                await this.wrapper.swap({token_: this.cold.address, amount:PREMINT});
            })
            
            // Un-Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when unswapping.", async function () {
                expect((await this.wrapper.unswap({token_: this.cold.address, amount:3}))
                    .to.emit(this.wrapper,"unswapped")
                    .withArgs('Cold',3));
            });

            // Can unswap token C for token B
            it("mints 'Cold' from 'Porridge'.", async function () {
                await this.wrapper.unswap({token_: this.cold.address, amount:3});
                const coldTotalSupply = await this.cold.totalSupply()
                expect(coldTotalSupply).to.equal(3);
            });

            // Token C ... should be burned ... from inside the Wrapper contract.
            // Can swap token B for token C
            it("burns 'Porridge' while minting 'Cold'.", async function () {
                await this.wrapper.unswap({token_: this.cold.address, amount:3});
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal(PREMINT - 3);
            });

            // Can't swap more token B than in balance.
            it("won't underrun 'Porridge' to mint 'Cold'.", async function () {
                expect(await this.wrapper.unswap({token_: this.cold.address, amount:101}))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning B doesn't seem plausible for this challenges' use cases.

        });

    });

    // "Feel free to add whatever other methods and contracts are necessary"
    // Nothing test-able.  More interfaces = more attack surfaces.
    // Design behavior tests exactly from requirements and known vulnerabilities they imply.
    // Code only to pass all tests.  Stop.  Deploy.

});

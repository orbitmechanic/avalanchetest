// test/Airdrop.js
// Load dependencies
const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const Web3 = require('web3');

const OWNER_ADDRESS = ethers.utils.getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const DECIMALS = 18; // Tokens may all have the same number of decimals.
const PREMINT = 100; // Amount to pre-mint of A and B.

const decimationBase = BigNumber.from(10);

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

    // Test token A|B
    describe("'Peas' token", function () {

        // Create contract factories once.
        before(async function () {
            // {Token A: 'Hot', Token B: 'Cold'} are both Peas.
            this.InputToken = await ethers.getContractFactory("Peas");
        });

        // Refresh contracts per test case.
        beforeEach(async function () {
            this.inputToken = await this.InputToken.deploy('Peas','PEAS', PREMINT);
            await this.inputToken.deployed();
        });

        // Please give each token its own unique name ...
        // Do not name them tokens A ...
        it("is called 'Peas'.", async function () {
            const inputTokenName = await this.inputToken.name();
            expect(inputTokenName).to.equal('Peas');
        });

        // Please give each token its own unique symbol
        it("has a 'PEAS' symbol.", async function () {
            const inputTokenSymbol = await this.inputToken.symbol();
            expect(inputTokenSymbol).to.equal('PEAS');
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
            const TokenUnit = decimationBase.pow(inputTokenDecimation);
            const inputTokenTotalSupply = BigNumber.from(await this.inputToken.totalSupply());
            const inputTokenTotalTokens = inputTokenTotalSupply.div(TokenUnit);
            expect(inputTokenTotalTokens.toNumber()).to.equal(PREMINT);
        });

        // Token A should be minted outside the wrapper contract.
        // Ensure Peas.mint() can be called externally.
        it("can be minted.", async function () {
            const inputTokenDecimation = await this.inputToken.decimals();
            const TokenUnit = decimationBase.pow(inputTokenDecimation);
            const oneHundredTokens = TokenUnit.mul(100);
            expect(await this.inputToken.mint(OWNER_ADDRESS, 100))
            .to.emit(this.inputToken, "Transfer")
            .withArgs(NULL_ADDRESS,OWNER_ADDRESS, oneHundredTokens.toString());
        })

        // Token A should be burned outside the wrapper contract.
        // Ensure Peas.burn() can be called externally.
        it("can be burned.", async function () {
            const inputTokenDecimation = await this.inputToken.decimals();
            const TokenUnit = decimationBase.pow(inputTokenDecimation);
            const fiftyTokens = TokenUnit.mul(50);
            expect(await this.inputToken.burn(OWNER_ADDRESS, 50))
            .to.emit(this.inputToken, "Transfer")
            .withArgs(OWNER_ADDRESS, NULL_ADDRESS, fiftyTokens.toString());
        })
    });

    // Test token C.
    describe("'Porridge' token", function () {

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
        // Ensure Porridge.mint() can be called from a "licensed" address:
        it("can be minted by the licensed address.", async function () {
            const outputTokenDecimation = await this.outputToken.decimals();
            const TokenUnit = decimationBase.pow(outputTokenDecimation);
            const oneHundredTokens = TokenUnit.mul(100);
            await this.outputToken.setMinter(OWNER_ADDRESS); 
            expect(await this.outputToken.mint(OWNER_ADDRESS, 100))
            .to.emit(this.outputToken, "Transfer")
            .withArgs(NULL_ADDRESS, OWNER_ADDRESS, oneHundredTokens.toString());
        });

        // Token C ... should be minted exclusively from inside the wrapper contract.
        // Ensure Porridge.mint() cannot be "cold-called".
        it("cannot be minted by an unlicensed address.", async function () {
            // No MINTER_ROLE assigned.
            await expect(this.outputToken.mint(OWNER_ADDRESS, 100))
            .to.be.reverted;
        });

        // Token C should be (burned exclusively inside wrapper contract).
        // Ensure Porridge.burn() can be called externally.
        it("can be burned.", async function () {
            const addressList = await ethers.getSigners();
            const outputTokenDecimation = await this.outputToken.decimals();
            const TokenUnit = decimationBase.pow(outputTokenDecimation);
            const fiftyTokens = TokenUnit.mul(50);
            await this.outputToken.setMinter(OWNER_ADDRESS);
            await this.outputToken.mint(OWNER_ADDRESS,100);
            // Burn OWNER_ADDRESS' Porridge tokens from a different address.
            expect(await this.outputToken.connect(addressList[1]).burn(OWNER_ADDRESS, 50))
            .to.emit(this.outputToken, "Transfer")
            .withArgs(OWNER_ADDRESS, NULL_ADDRESS, fiftyTokens.toString());
        });

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
            await this.porridge.setMinter(this.wrapper.address);
        });

        // Can swap token A for token C
        describe("Can swap 'Hot' for 'Porridge'.", function () {
            
            // Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when swapping.", async function () {
                expect(await this.wrapper.swap(this.hot.address, 3))
                    .to.emit(this.wrapper,"Swapped")
                    .withArgs('Hot','Porridge',"3");
            });

            // Token C ... should be minted ... from inside the Wrapper contract.
            // Can swap token A for token C
            it("mints 'Porridge' from 'Hot'.", async function () {
                await this.wrapper.swap(this.hot.address, 3);
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal("3000000000000000000");
            });

            // Can swap token A for token C
            it("burns 'Hot' while minting 'Porridge'.", async function () {
                await this.wrapper.swap(this.hot.address, 3);
                const hotTotalSupply = await this.hot.totalSupply();
                expect(hotTotalSupply).to.equal("97000000000000000000");
            });

            // Can't swap more token A than in balance.
            it("won't underrun 'Hot' to mint 'Porridge'.", async function () {
                await expect(this.wrapper.swap(this.hot.address, 101))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning C doesn't seem plausible for this challenges' lifespan.

        });

        // Can swap token B for token C
        describe("Can swap 'Cold' for 'Porridge'.", function () {

            // Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when swapping.", async function () {
                expect(await this.wrapper.swap(this.cold.address, 3))
                    .to.emit(this.wrapper,"Swapped")
                    .withArgs('Cold','Porridge',"3");
            });

            // Token C ... should be minted ... from inside the Wrapper contract.
            // Can swap token B for token C
            it("mints 'Porridge' from 'Cold'.", async function () {
                await this.wrapper.swap(this.cold.address, 3);
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal("3000000000000000000");
            });

            // Can swap token A for token C
            it("burns 'Cold' while minting 'Porridge'.", async function () {
                await this.wrapper.swap(this.cold.address, 3);
                const coldTotalSupply = await this.cold.totalSupply();
                expect(coldTotalSupply).to.equal("97000000000000000000");
            });

            // Can't swap more token B than in balance.
            it("won't underrun 'Cold' to mint 'Porridge'.", async function () {
                await expect(this.wrapper.swap(this.cold.address, 101))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning C doesn't seem plausible for this challenges' lifespan
        });
        
        // Swaps should also be possible in the reverse direction.
        describe("Can un-swap 'Porridge' for 'Hot'.", function () {

            // Need to pre-load token C for testing (from token A)
            beforeEach(async function () {
                await this.wrapper.swap(this.hot.address, PREMINT);
            })
            
            // Un-Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when unswapping.", async function () {
                expect(await this.wrapper.unswap(this.hot.address, 3))
                    .to.emit(this.wrapper,"Swapped")
                    .withArgs('Porridge','Hot',"3");
            });

            // Can unswap token C for token A
            it("mints 'Hot' from 'Porridge'.", async function () {
                await this.wrapper.unswap(this.hot.address, 3);
                const hotTotalSupply = await this.hot.totalSupply();
                expect(hotTotalSupply).to.equal("3000000000000000000");
            });

            // Token C ... should be burned ... from inside the Wrapper contract.
            // Can swap token A for token C
            it("burns 'Porridge' while minting 'Hot'.", async function () {
                await this.wrapper.unswap(this.hot.address, 3);
                const porridgeTotalSupply = await this.porridge.totalSupply()
                expect(porridgeTotalSupply).to.equal("97000000000000000000");
            });

            // Can't swap more token A than in balance.
            it("won't underrun 'Porridge' to mint 'Hot'.", async function () {
                await expect(this.wrapper.unswap(this.hot.address, 101))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning A doesn't seem plausible for this challenges' lifespan.

        });
 
        // Swaps should also be possible in the reverse direction.
        describe("Can un-swap 'Porridge' for 'Cold'.", function () {

            // Need to pre-load token C for testing (from token B)
            beforeEach(async function () {
                await this.wrapper.swap(this.cold.address, PREMINT);
            })
            
            // Un-Swapping can be indexed 
            // (For auditing convienence. There is no requirement for this.)
            it("emits event when unswapping.", async function () {
                expect(await this.wrapper.unswap(this.cold.address, 3))
                    .to.emit(this.wrapper,"Swapped")
                    .withArgs('Porridge','Cold',"3");
            });

            // Can unswap token C for token B
            it("mints 'Cold' from 'Porridge'.", async function () {
                await this.wrapper.unswap(this.cold.address, 3);
                const coldTotalSupply = await this.cold.totalSupply()
                expect(coldTotalSupply).to.equal("3000000000000000000");
            });

            // Token C ... should be burned ... from inside the Wrapper contract.
            // Can swap token B for token C
            it("burns 'Porridge' while minting 'Cold'.", async function () {
                await this.wrapper.unswap(this.cold.address, 3);
                const porridgeTotalSupply = await this.porridge.totalSupply();
                expect(porridgeTotalSupply).to.equal("97000000000000000000");
            });

            // Can't swap more token B than in balance.
            it("won't underrun 'Porridge' to mint 'Cold'.", async function () {
                await expect(this.wrapper.unswap(this.cold.address, 101))
                    .to.be.reverted;
            });

            // Non-test:
            // Overrunning B doesn't seem plausible for this challenges' lifespan.

        });

    });

    // "Feel free to add whatever other methods and contracts are necessary"
    // Nothing test-able.  More interfaces = more attack surfaces.
    // Design behavior tests exactly from requirements and known vulnerabilities they imply.
    // Code only to pass all tests.  Stop.  Deploy.

});

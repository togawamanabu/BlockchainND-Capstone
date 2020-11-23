var RealEstateNdERC721Token = artifacts.require('RealEstateNdERC721Token');

contract('RealEstateNdERC721Token', accounts => {

    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2]; 
    const account3 = accounts[3]; 

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await RealEstateNdERC721Token.new({from: owner});

            //TODO: mint multiple tokens
            await this.contract.mint(account1, 1, {from: owner});
            await this.contract.mint(account1, 2, {from: owner});
            await this.contract.mint(account2, 3, {from: owner});
            await this.contract.mint(account2, 4, {from: owner});
        })

        it('should return total supply', async function () { 
            let rtn = await this.contract.totalSupply();
            assert.equal(rtn.toNumber(), 4, 'should return minted count' );
        })

        it('should get token balance', async function () { 
            let rtn = await this.contract.balanceOf(account1);
            assert.equal(rtn.toNumber(), 2, 'should return minited count for account');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let rtn = await this.contract.tokenURI(1, {from: account1});
            assert.equal(rtn, 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1', 'should return uri');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.approve(account2, 1, {from: account1});
            await this.contract.transferFrom(account1, account2, 1, {from: account2});

            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account2, 'owner should transfered');            
        })

        it('should not transfer without approve', async function () {
            let revert = false;
            try {
                await this.contract.transferFrom(account2, account3, 1, {from: account3});
            } catch {
                revert = true;
            }

            assert.equal(revert, true, 'should revert without approve');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await RealEstateNdERC721Token.new({from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let revert = false;
            try{
                await this.contract.mint(account3, 1, {from: account1});
            } catch {
                revert = true;
            }

            assert.equal(revert, true, 'should revert only owner can mint');            
        })

        it('should return contract owner', async function () { 
            let rtn = await this.contract.getOwner({from: account1});
            assert.equal(rtn, owner, 'contract owner should be owner address');
        })

    });
})
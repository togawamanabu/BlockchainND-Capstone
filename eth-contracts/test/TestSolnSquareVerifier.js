let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
let proof = require('../../zokrates/code/square/proof.json');

contract('SolnSquareVerifier', accounts => {
  let owner = accounts[0];
  let account = accounts[1];

  describe('Minting test', async() => {
    beforeEach(async() => {
      this.contract = await SolnSquareVerifier.new({from: owner});
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('new solution can be added', async() => {
      let tx = await this.contract.mintVerify(account, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: owner});

      assert.equal(tx.logs[0].event, 'SolutionAdded', "Solution Added event should be emited")
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('can mint with correct proof', async() => {
      await this.contract.mintVerify(account, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: owner});

      let balance = await this.contract.balanceOf(account);
      assert.equal(balance, 1, 'token balance should be 1');

    })

    it('can not mint with same proof', async() => {
      await this.contract.mintVerify(account, 1, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: owner});

      let revert = false;
      try{
        await this.contract.mintVerify(account, 2, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: owner});
      } catch {
        revert = true;
      }

      assert.equal(revert, true, 'should be revert');
    })

  });


});

const FiveToken = artifacts.require("FiveToken");
const truffleAssert = require("truffle-assertions"); // needed to use truffle test
// const { assert } = require('chai');

contract("Stakeable_1", async accounts => {

    it("Stacking 100x2", async () => {
        let fiveToken = await FiveToken.deployed();
        
        let owner = accounts[0];
        let user1 = accounts[1];
        let stake_amount = 100;

        await fiveToken.mint(user1, 1000);
        
        let stakeFuncID = await fiveToken.stake(stake_amount, { from: user1 });
        // Assert on the emittedevent using truffleassert
        // This will capture the event and inside the 
        // event callback we can use assert on the values returned
        truffleAssert.eventEmitted(
            stakeFuncID,
            "Staked",
            (ev) => {
                // In here we can do our assertion on the ev variable
                // (its the event and will contain the values we emitted)
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index, 1, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");

        // Do it again
        let stakeFunc2ID = await fiveToken.stake(stake_amount, { from: user1 });
        truffleAssert.eventEmitted(
            stakeFunc2ID,
            "Staked",
            (ev) => {
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index, 1, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");
        
        let balanceOwner = await fiveToken.balanceOf(owner)
        let balanceUser1 = await fiveToken.balanceOf(user1)
        assert.equal(balanceOwner.toNumber(), 5000000000, "Owner should have his 5M initial");
        assert.equal(balanceUser1.toNumber(), 800, "User1 should have 1000 - 100*2 = 800 token");

    });

    it("cannot stake more than owning", async() => {

        // Stake too much on accounts[2]
        let fiveToken = await FiveToken.deployed();

        try {
            await fiveToken.stake(42, { from: accounts[2]});
        } catch(error) {
            assert.equal(error.reason, "FiveToken: Cannot stake more than you own");
        }
    });

    it("new stakeholder should have increased index (1/2)", async () => {
        let stake_amount = 100;

        let fiveToken = await FiveToken.deployed();
        
        let owner = accounts[0];
        let user1 = accounts[1];
        
        await fiveToken.mint(user1, 1000);

        let stake1FuncID = await fiveToken.stake(stake_amount, { from: owner });
        truffleAssert.eventEmitted(
            stake1FuncID,
            "Staked",
            (ev) => {
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index.toNumber(), 2, "Stake index was not correct (owner)");
                return true;
            },
            "Stake event should have triggered");
       
        let stakeFuncID = await fiveToken.stake(stake_amount, { from: user1 });
    
        truffleAssert.eventEmitted(
            stakeFuncID,
            "Staked",
            (ev) => {
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index.toNumber(), 1, "Stake index was not correct (user1)");
                return true;
            },
            "Stake event should have triggered");
    })

    it("new stakeholder should have increased index (2/2)", async () => {
        let stake_amount = 100;
        let fiveToken = await FiveToken.deployed();
        let stakeID = await fiveToken.stake(stake_amount, { from: accounts[1] });
        
        truffleAssert.eventEmitted(
            stakeID,
            "Staked",
            (ev) => {
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index.toNumber(), 1, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");
    })

});
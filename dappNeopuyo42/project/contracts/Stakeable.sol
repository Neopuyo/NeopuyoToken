// SPDX-License-Identifier: MIT
pragma solidity >0.4.0 <= 0.8.24;


contract Stakeable {

    struct Stake {
        address user;
        uint256 amount;
        uint256 since;
        uint256 claimable; // the available reward amount from staking
    }

    struct Stakeholder {
        address user;
        Stake[] address_stakes;
    }

    struct StakingSummary{
        uint256 total_amount;
        Stake[] stakes;
    }

    uint256 internal rewardPerHour = 1000; // 0.001 / 1%

    /* attributes */
    Stakeholder[] internal stakeholders;

    mapping(address => uint256) internal indexOf; // to 

    constructor() {
        stakeholders.push(); // push empty item to avoid issue of index - 1 [?] still needed [?]
    }


    /* logs */
    event Staked(address indexed user, uint256 amount, uint256 index, uint256 timestamp);

    /* internal methods */
    function _addStakeholder(address newStake) internal returns (uint256) {
        stakeholders.push(); // making a slot for the new item
        uint256 index = stakeholders.length - 1;
        stakeholders[index].user = newStake;
        indexOf[newStake] = index; // keeping index to avoid iterating array -> save gas 
        return index;
    }

    function _stake(uint256 amount) internal {
        require(amount > 0, "Staking: Cannot stake a 0 amount");

        uint256 senderIndex = indexOf[msg.sender];
        uint256 timestamp = block.timestamp;

        if (senderIndex == 0) {
            senderIndex = _addStakeholder(msg.sender);
        }

        stakeholders[senderIndex].address_stakes.push(Stake(msg.sender, amount, timestamp, 0));
        emit Staked(msg.sender, amount, senderIndex, timestamp);
    }

    function calculateStakeReward(Stake memory _current_stake) internal view returns(uint256) {
        return (((block.timestamp - _current_stake.since) / 1 hours) * _current_stake.amount) / rewardPerHour;
    }

    function _withdrawStake(uint256 amount, uint256 index) internal returns(uint256) {
        uint256 user_index = indexOf[msg.sender];

        // memory keyword -> store the data temporarily
        Stake memory current_stake = stakeholders[user_index].address_stakes[index];
        require(current_stake.amount >= amount, "Staking: Cannot withdraw more than you have staked");

        
         uint256 reward = calculateStakeReward(current_stake);
         current_stake.amount = current_stake.amount - amount;
         

         if (current_stake.amount == 0) {
            // clean empty stake for gas refund
            delete stakeholders[user_index].address_stakes[index];

         } else {
            stakeholders[user_index].address_stakes[index].amount = current_stake.amount; 
            stakeholders[user_index].address_stakes[index].since = block.timestamp; // Reset timer of stake    
         }

         return amount+reward;

     }

     /* public methods */
    function hasStake(address staker) public view returns (StakingSummary memory) {
        uint256 totalStakeAmount; 
        // Keep a summary in memory since we need to calculate this
        StakingSummary memory summary = StakingSummary(0, stakeholders[indexOf[staker]].address_stakes);
        // Itterate all stakes and grab amount of stakes
        for (uint256 s = 0; s < summary.stakes.length; s += 1){
           uint256 availableReward = calculateStakeReward(summary.stakes[s]);
           summary.stakes[s].claimable = availableReward;
           totalStakeAmount = totalStakeAmount+summary.stakes[s].amount;
       }
       // Assign calculate amount to summary
       summary.total_amount = totalStakeAmount;
        return summary;
    }

}


/* Globals in solidity
    block => current block | timestamp
    msg => transaction data | sender, value
    this => the current contract, can be cast as address
 */

 /* -- Method calculateStakeReward details --
    First calculate how long the stake has been active
    Use current seconds since epoch - the seconds since epoch the stake was made
    The output will be duration in SECONDS ,
    We will reward the user 0.1% per Hour So thats 0.1% per 3600 seconds
    the alghoritm is  seconds = block.timestamp - stake seconds (block.timestap - _stake.since)
    hours = Seconds / 3600 (seconds /3600) 3600 is an variable in Solidity names hours
    we then multiply each token by the hours staked , then divide by the rewardPerHour rate 
 */
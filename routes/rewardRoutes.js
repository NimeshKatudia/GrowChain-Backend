// routes/rewardRoutes.js
const express = require('express');
const RewardTransaction = require('../models/rewardTransaction');
const Farmer = require('../models/farmer');
const router = express.Router();

// Route to issue a reward to a farmer
router.post('/issue-reward', async (req, res) => {
    const { farmerId, rewardAmount } = req.body;
    try {
        // Check if farmer exists
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Issue the reward and update the farmer's total rewards
        farmer.totalRewards += rewardAmount;
        await farmer.save();

        const rewardTransaction = new RewardTransaction({ farmerId, rewardAmount });
        await rewardTransaction.save();

        res.status(201).json(rewardTransaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to issue reward', details: err.message });
    }
});

// Route to get all reward transactions
router.get('/', async (req, res) => {
    try {
        const rewards = await RewardTransaction.find().populate('farmerId');
        res.status(200).json(rewards);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch rewards', details: err.message });
    }
});

module.exports = router;

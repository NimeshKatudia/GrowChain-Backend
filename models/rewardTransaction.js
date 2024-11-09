// models/rewardTransaction.js
const mongoose = require('mongoose');

// Define the schema for reward transactions
const rewardTransactionSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    rewardAmount: { type: Number, required: true },
    rewardDate: { type: Date, default: Date.now },
});

const RewardTransaction = mongoose.model('RewardTransaction', rewardTransactionSchema);

module.exports = RewardTransaction;

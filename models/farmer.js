const mongoose = require('mongoose');

// Farmer schema (removed walletAddress field)
const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    totalRewards: {
        type: Number,
        default: 0,  // Default total rewards to 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Farmer', farmerSchema);

const mongoose = require("mongoose");

// Farmer schema
const farmerSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  selectedCrops: {
    type: [String], // Array of crop names
    default: [],
  },
  totalRewards: {
    type: Number,
    default: 0, // Default total rewards to 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEligible: {
    type: Boolean,
    default: false, // Default to not eligible
  },
  claimStatus: {
    type: Boolean,
    default: false, // Default to not claimed
  },
  sustainabilityReasons: {
    type: [String], // Reasons for meeting sustainability criteria
    default: [],
  },
});

module.exports = mongoose.model("Farmer", farmerSchema);

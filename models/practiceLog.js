// models/practiceLog.js
const mongoose = require('mongoose');

// Define the schema for logging farming practices
const practiceLogSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    practiceType: { type: String, required: true },
    practiceDetails: { type: String },
    practiceDate: { type: Date, default: Date.now },
});

const PracticeLog = mongoose.model('PracticeLog', practiceLogSchema);

module.exports = PracticeLog;

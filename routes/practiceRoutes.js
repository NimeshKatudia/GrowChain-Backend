// routes/practiceRoutes.js
const express = require('express');
const PracticeLog = require('../models/practiceLog');
const Farmer = require('../models/farmer');
const router = express.Router();

// Route to log a farming practice for a specific farmer
router.post('/log-practice', async (req, res) => {
    const { farmerId, practiceType, practiceDetails } = req.body;
    try {
        // Check if farmer exists
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Create and save the practice log
        const practiceLog = new PracticeLog({ farmerId, practiceType, practiceDetails });
        await practiceLog.save();

        res.status(201).json(practiceLog);
    } catch (err) {
        res.status(400).json({ error: 'Failed to log farming practice', details: err.message });
    }
});

// Route to get all practice logs
router.get('/', async (req, res) => {
    try {
        const practiceLogs = await PracticeLog.find().populate('farmerId');
        res.status(200).json(practiceLogs);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch practice logs', details: err.message });
    }
});

module.exports = router;

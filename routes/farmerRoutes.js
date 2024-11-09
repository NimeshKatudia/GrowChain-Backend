// routes/farmerRoutes.js
const express = require('express');
const Farmer = require('../models/farmer');
const router = express.Router();

// Route to register a new farmer
router.post('/register', async (req, res) => {
    const { walletAddress, name, email } = req.body;
    try {
        const farmer = new Farmer({ walletAddress, name, email });
        await farmer.save();  // Save to MongoDB
        res.status(201).json(farmer);  // Respond with the farmer object
    } catch (err) {
        res.status(400).json({ error: 'Farmer registration failed', details: err.message });
    }
});

// Route to get all farmers (for testing)
router.get('/', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json(farmers);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch farmers', details: err.message });
    }
});

module.exports = router;

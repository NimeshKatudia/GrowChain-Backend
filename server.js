const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Farmer = require('./models/farmer'); // Import the Farmer model

// Load environment variables
dotenv.config();

const app = express();
const { MONGO_URI } = process.env;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

// Register a new farmer (without walletAddress)
app.post('/api/farmer/register', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if the farmer already exists
        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({ message: 'Farmer already registered with this email' });
        }

        // Create a new farmer (no walletAddress)
        const newFarmer = new Farmer({
            name,
            email,
            totalRewards: 0,  // Default rewards to 0
        });

        await newFarmer.save();
        return res.status(201).json(newFarmer);
    } catch (error) {
        console.error('Error registering farmer:', error);
        return res.status(500).json({ message: 'Error registering farmer' });
    }
});

// Get all farmers
app.get('/api/farmer', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        return res.status(200).json(farmers);
    } catch (error) {
        console.error('Error retrieving farmers:', error);
        return res.status(500).json({ message: 'Error retrieving farmers' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

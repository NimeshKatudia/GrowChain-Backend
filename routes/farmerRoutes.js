const express = require("express");
const Farmer = require("../models/farmer");
const router = express.Router();

// Route to register a new farmer
router.post("/register", async (req, res) => {
  const { address, fname, lname, phone_number, selectedCrops } = req.body;
  try {
    const farmer = new Farmer({
      address,
      fname,
      lname,
      phone_number,
      selectedCrops,
    });
    await farmer.save(); // Save to MongoDB
    res.status(201).json(farmer); // Respond with the farmer object
  } catch (err) {
    res
      .status(400)
      .json({ error: "Farmer registration failed", details: err.message });
  }
});

// Route to get all farmers
router.get("/", async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to fetch farmers", details: err.message });
  }
});

// Route to get a single farmer by address
router.get("/:address", async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ address: req.params.address });
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to fetch farmer", details: err.message });
  }
});

// Route to update a farmer's profile
router.put("/:address", async (req, res) => {
  const { fname, lname, selectedCrops } = req.body;

  try {
    // Use `findOneAndUpdate` with options to return the updated document and run validators
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { address: req.params.address },
      { fname, lname, selectedCrops },
      {
        new: true, // Return the updated document
        upsert: false, // Do not create a new document if the ID doesn't exist
      }
    );

    if (!updatedFarmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.status(200).json(updatedFarmer);
  } catch (err) {
    // Handle duplicate key error for phone_number specifically
    if (err.code === 11000 && err.keyPattern && err.keyPattern.phone_number) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    res
      .status(400)
      .json({ error: "Failed to update farmer", details: err.message });
  }
});

module.exports = router;

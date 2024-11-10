const Farmer = require("../models/farmer");

// Register a new farmer
const registerFarmer = async (req, res) => {
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
};

// Get all farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to fetch farmers", details: err.message });
  }
};

// Get a single farmer by address
const getFarmerByAddress = async (req, res) => {
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
};

// Update a farmer's profile
const updateFarmerProfile = async (req, res) => {
  const { fname, lname, selectedCrops } = req.body;

  try {
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { address: req.params.address },
      { fname, lname, selectedCrops },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators
      }
    );

    if (!updatedFarmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.status(200).json(updatedFarmer);
  } catch (err) {
    // Handle duplicate key error for phone_number
    if (err.code === 11000 && err.keyPattern && err.keyPattern.phone_number) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    res
      .status(400)
      .json({ error: "Failed to update farmer", details: err.message });
  }
};

const updateEligibilityStatus = async (req, res) => {
  const { farmerId, isEligible, claimStatus, sustainabilityReasons } = req.body;

  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    farmer.isEligible = isEligible;
    farmer.claimStatus = claimStatus;
    farmer.sustainabilityReasons = sustainabilityReasons;

    await farmer.save();
    res
      .status(200)
      .json({ message: "Farmer eligibility and claim status updated", farmer });
  } catch (error) {
    res.status(500).json({ error: "Error updating farmer status" });
  }
};

// Fetch rewards for farmers
const fetchAllFarmersRewards = async (req, res) => {
  try {
    const farmers = await Farmer.find(); // Fetch all farmers

    // Map over each farmer to extract reward details
    const rewards = farmers.map((farmer) => ({
      address: farmer.address,
      totalRewards: farmer.totalRewards,
      isEligible: farmer.isEligible,
      claimStatus: farmer.claimStatus,
      sustainabilityReasons: farmer.sustainabilityReasons,
    }));

    res.status(200).json(rewards); // Return an array of reward details
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching rewards", details: error.message });
  }
};

module.exports = {
  registerFarmer,
  getAllFarmers,
  getFarmerByAddress,
  updateFarmerProfile,
  fetchAllFarmersRewards,
  updateEligibilityStatus,
};

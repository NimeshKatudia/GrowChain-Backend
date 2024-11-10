const express = require("express");
const {
  registerFarmer,
  getAllFarmers,
  getFarmerByAddress,
  updateFarmerProfile,
  updateEligibilityStatus,
  fetchAllFarmersRewards,
} = require("../routes/farmerRoutes");

const router = express.Router();

// Route to register a new farmer
router.post("/register", registerFarmer);

// Route to get all farmers
router.get("/", getAllFarmers);

// Route to get a single farmer by address
router.get("/:address", getFarmerByAddress);

// Route to update a farmer's profile

router.put("/:address", updateFarmerProfile);
router.put("/update-status/:address", updateEligibilityStatus);

module.exports = router;

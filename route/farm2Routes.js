const express = require("express");
const { fetchAllFarmersRewards } = require("../routes/farmerRoutes");
const router = express.Router();

// Define route for fetching all farmer rewards
router.get("/fetch-rewards", fetchAllFarmersRewards);

module.exports = router;

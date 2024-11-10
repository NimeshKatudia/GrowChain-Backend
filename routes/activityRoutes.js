const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const { check, validationResult } = require("express-validator");

router.post(
  "/add",
  [
    check("farmerId", "Farmer ID is required").not().isEmpty(),
    check("crop", "Crop is required").not().isEmpty(),
    check("quality", "Quality is required").not().isEmpty(),
    check("moisture", "Moisture is required").isNumeric(),
    check("fertilizer", "Fertilizer is required").not().isEmpty(),
    check("date", "Date is required").not().isEmpty(),
    check("desc", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { farmerId, crop, quality, moisture, fertilizer, date, desc } =
      req.body;

    try {
      const newActivity = new Activity({
        farmerId,
        crop,
        quality,
        moisture,
        fertilizer,
        date,
        desc,
      });

      await newActivity.save();
      return res.status(201).json({
        message: "Activity added successfully",
        activity: newActivity,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all activities of a farmer
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const activities = await Activity.find({ farmerId: req.params.farmerId });
    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No activities found for this farmer" });
    }
    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

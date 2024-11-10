const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    crop: {
      type: String,
      enum: ["Wheat", "Millet", "Corn", "Ragi", "Barley", "Apple", "Litchi", "Kiwi", "Banana"], // Add more crops as needed
      required: true,
    },
    quality: { type: String, required: true },
    moisture: { type: Number, required: true }, // Moisture percentage
    fertilizer: { type: String, required: true },
    date: { type: Date, required: true },
    desc: { type: String, required: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

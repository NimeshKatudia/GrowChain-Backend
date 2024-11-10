const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const farmerRoutes = require("./routes/farmerRoutes");
const activityRoutes = require("./routes/activityRoutes");
const farmRoutes = require("./route/farmRoute"); // Ensure this path is correct
const farm2Routes = require("./route/farm2Routes"); // Ensure this path is correct

// Load environment variables
dotenv.config();

const app = express();
const { MONGO_URI } = process.env;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Register routes
app.use("/api/farmers", farmRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/farms", farm2Routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Farmer = require("./models/farmer"); // Import the Farmer model
const farmerRoutes = require('./routes/farmerRoutes'); 
const activityRoutes = require("./routes/activityRoutes"); 

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

app.use("/api/farmers", farmerRoutes);
app.use("/api/activity", activityRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

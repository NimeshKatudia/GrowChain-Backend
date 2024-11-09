// config.js
require('dotenv').config();  // Load environment variables from .env

module.exports = {
    dbURI: process.env.MONGO_URI,  // MongoDB URI from the environment variables
};

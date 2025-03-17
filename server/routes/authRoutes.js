const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const validateRegister = require("../middleware/validateRegister");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting: Allow max 5 requests per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});

// Register route with validation
router.post("/register", limiter, validateRegister, registerUser);

// Login route with rate limiting
router.post("/login", limiter, loginUser);

module.exports = router;

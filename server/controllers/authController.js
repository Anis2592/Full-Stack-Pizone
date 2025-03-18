const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// Utility function for error response
const sendErrorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Registration Controller
const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { name, username, email, password, role } = req.body;

    // Basic Validation
    if (!name || !username || !email || !password || !role) {
      return sendErrorResponse(res, 400, "All fields are required");
    }

    // Check for existing user by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return sendErrorResponse(res, 400, "Email or username already in use");
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const newUser = new User({ name, username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, 400, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    console.log("User Found:", user);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

module.exports = { registerUser, loginUser };
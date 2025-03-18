const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const validateRegister = require("../middleware/validateRegister");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Rate limiting: Allow max 5 requests per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});
router.get("/validate-token", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});
// Register route with validation
router.post("/register", limiter, validateRegister, registerUser);

// Login route with rate limiting
router.post("/login", limiter, loginUser);

module.exports = router;
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // ✅ User Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body; // ✅ Use emailId instead of email

//     console.log("📥 Login Request:", req.body); // Debugging step

//     // ✅ Find user by emailId
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ✅ Compare Password (Ensure Password is Hashed)
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ✅ Generate JWT Token
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     res.status(200).json({ message: "Login successful", token, user });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// // const express = require("express");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // const router = express.Router();

// // // ✅ Login Route (Ensure It Exists)
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { emailId, password } = req.body; // ✅ Ensure emailId is used

// //     console.log("📥 Login Request:", req.body); // Debugging request data

// //     // ✅ Check if user exists
// //     const user = await User.findOne({ emailId });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     // ✅ Compare password (Ensure password is hashed)
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     // ✅ Generate JWT Token
// //     const token = jwt.sign(
// //       { userId: user._id, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "2h" }
// //     );

// //     res.status(200).json({ message: "Login successful", token, user });
// //   } catch (error) {
// //     console.error("❌ Login Error:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // module.exports = router;

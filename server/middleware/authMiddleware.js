const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id || decoded.userId, role: decoded.role };

    // ✅ Only log once per request, not continuously
    if (!req.hasLoggedUser) {
      console.log("✅ Authenticated User:", req.user);
      req.hasLoggedUser = true; // This flag exists only during this request lifecycle
    }

    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
 
//   try {
//     const authHeader = req.header("Authorization");
    
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized Access" });
//     }

//     const token = authHeader.split(" ")[1]; // Extract token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Ensure correct user ID extraction
//     req.user = { id: decoded.id || decoded.userId, role: decoded.role };

//     console.log("Authenticated User:", req.user); // Debugging
//     next();
//   } catch (err) {
//     console.error("Auth Middleware Error:", err.message);
//     return res.status(401).json({ message: "Unauthorized Access" });
//   }
// };

// module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.header("Authorization");
    
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized Access" });
//     }

//     const token = authHeader.split(" ")[1]; // Extract token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Ensure correct user ID extraction
//     req.user = { id: decoded.id || decoded.userId, role: decoded.role };

//     console.log("Authenticated User:", req.user); // Debugging
//     next();
//   } catch (err) {
//     console.error("Auth Middleware Error:", err.message);
//     return res.status(401).json({ message: "Unauthorized Access" });
//   }
// };

// module.exports = authMiddleware;

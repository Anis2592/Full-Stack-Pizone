const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Safer token extraction
        if (!token) return res.status(401).json({ message: "Unauthorized Access" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); // Ensure correct ID key

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin Access Required" });
        }

        req.user = user; // Attach user data to request object
        next();
    } catch (error) {
        console.error("Admin verification error:", error.message);
        return res.status(401).json({ message: "Unauthorized Access" });
    }
};

module.exports = verifyAdmin;

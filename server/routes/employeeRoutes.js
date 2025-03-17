const express = require("express");
const Employee = require("../models/Employee");
const User = require("../models/User");
const verifyAdmin = require("../middleware/authAdmin");
const authMiddleware = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Employee ID format" });
  }
  next();
};

// ✅ Get the logged-in employee (Authenticated User)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);

    // Find employee using email instead of ID
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const employee = await Employee.findOne({ emailid: req.user.email });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ message: "Error fetching employee details" });
  }
});

// ✅ Get all employees (Admin Only)
router.get("/employees", verifyAdmin, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "An error occurred while fetching employees." });
  }
});

// ✅ Get a single employee by ID (Admin Only)
router.get("/:id", verifyAdmin, validateObjectId, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Error fetching employee details" });
  }
});

// ✅ Add a new employee (Admin Only)
router.post(
  "/",
  verifyAdmin,
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("emailid").isEmail().withMessage("Valid email is required"),
    check("dateofbirth").isISO8601().withMessage("Valid date of birth is required"),
    check("dateofjoining")
      .isISO8601()
      .withMessage("Valid date of joining is required")
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.dateofbirth)) {
          throw new Error("Date of joining cannot be before date of birth");
        }
        return true;
      }),
  ],
  async (req, res) => {
    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newEmployee = new Employee(req.body);
      await newEmployee.save();
      res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
    } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ message: "An error occurred while adding the employee." });
    }
  }
);

// ✅ Update employee details (Admin Only)
router.put("/:id", verifyAdmin, validateObjectId, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
});

// ✅ Delete employee (Admin Only)
router.delete("/:id", verifyAdmin, validateObjectId, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;

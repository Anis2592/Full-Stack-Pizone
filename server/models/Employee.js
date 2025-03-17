const mongoose = require("mongoose");

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensure name is always provided
      trim: true, // Remove unnecessary spaces
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique for each employee
      lowercase: true, // Store emails in lowercase for consistency
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Email format validation
    },
    jobTitle: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    language: { type: String, trim: true },
    paidVacationDays: {
      type: Number,
      default: 0, // Default value of 0 if not provided
      min: 0, // Ensure non-negative values
    },
    paidSickDays: {
      type: Number,
      default: 0, // Default value of 0 if not provided
      min: 0, // Ensure non-negative values
    },
    dateOfBirth: {
      type: Date,
      required: true, // Ensure date of birth is provided
    },
    dateOfJoining: {
      type: Date,
      required: true, // Ensure date of joining is provided
      validate: {
        validator: function (value) {
          return value >= this.dateOfBirth; // Ensure joining date is not before birth date
        },
        message: "Date of joining cannot be before date of birth",
      },
    },
  },
  { timestamps: true } // Automatically add createdAt & updatedAt fields
);

// Format date fields when converting to JSON
employeeSchema.methods.toJSON = function () {
  const obj = this.toObject();

  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : null); // Format to YYYY-MM-DD

  obj.dateOfBirth = formatDate(obj.dateOfBirth);
  obj.dateOfJoining = formatDate(obj.dateOfJoining);
  obj.createdAt = formatDate(obj.createdAt);
  obj.updatedAt = formatDate(obj.updatedAt);

  return obj;
};

// Create and export the Employee model
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;

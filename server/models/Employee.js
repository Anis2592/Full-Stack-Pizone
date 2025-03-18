const mongoose = require("mongoose");
const moment = require("moment"); // Import moment for date formatting

// Define the employee schema
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensure name is always provided
    },
    emailid: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique for each employee
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Email format validation
    },
    jobTitle: String,
    city: String,
    state: String,
    paymentMethod: String,
    language: String,
    paidVacationDays: {
      type: Number,
      default: 0, // Default value of 0 if not provided
    },
    paidSickDays: {
      type: Number,
      default: 0, // Default value of 0 if not provided
    },
    dateofbirth: {
      type: Date,
      required: true, // Ensure date of birth is provided
    },
    dateofjoining: {
      type: Date,
      required: true, // Ensure date of joining is provided
    },
  },
  { timestamps: true } // Automatically add createdAt & updatedAt fields
);

// Format date fields when converting to JSON
employeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  
  obj.dateofbirth = obj.dateofbirth ? moment(obj.dateofbirth).format("DD-MM-YYYY") : null;
  obj.dateofjoining = obj.dateofjoining ? moment(obj.dateofjoining).format("DD-MM-YYYY") : null;
  obj.createdAt = obj.createdAt ? moment(obj.createdAt).format("DD-MM-YYYY HH:mm:ss") : null;
  obj.updatedAt = obj.updatedAt ? moment(obj.updatedAt).format("DD-MM-YYYY HH:mm:ss") : null;

  return obj;
};

// Create and export the Employee model
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;

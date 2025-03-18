const Employee = require("../models/Employee");
const mongoose = require("mongoose");

// Utility function for error response
const sendErrorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Controller to add an employee
const addEmployee = async (req, res) => {
  try {
    const { 
      name, emailid, jobTitle, city, state, paymentMethod, language, 
      paidVacationDays, paidSickDays, dateofbirth, dateofjoining 
    } = req.body;

    // Check required fields
    if (!name || !emailid || !dateofbirth || !dateofjoining) {
      return sendErrorResponse(res, 400, "Name, email, date of birth, and date of joining are required.");
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(emailid)) {
      return sendErrorResponse(res, 400, "Invalid email format.");
    }

    // Validate date formats
    const parsedDateOfBirth = new Date(dateofbirth);
    const parsedDateOfJoining = new Date(dateofjoining);
    if (isNaN(parsedDateOfBirth.getTime()) || isNaN(parsedDateOfJoining.getTime())) {
      return sendErrorResponse(res, 400, "Invalid date format. Please provide valid dates.");
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ emailid });
    if (existingEmployee) {
      return sendErrorResponse(res, 400, "An employee with this email already exists.");
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      emailid,
      jobTitle,
      city,
      state,
      paymentMethod,
      language,
      paidVacationDays: paidVacationDays || 0,
      paidSickDays: paidSickDays || 0,
      dateofbirth: parsedDateOfBirth,
      dateofjoining: parsedDateOfJoining,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    console.error("Error adding employee:", err);
    sendErrorResponse(res, 500, "An error occurred while adding the employee.");
  }
};

// Controller to update an employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, emailid, jobTitle, city, state, paymentMethod, language, 
      paidVacationDays, paidSickDays, dateofbirth, dateofjoining 
    } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, 400, "Invalid employee ID.");
    }

    // Prepare updated data
    const updatedData = { name, emailid, jobTitle, city, state, paymentMethod, language, paidVacationDays, paidSickDays };

    if (dateofbirth) {
      const parsedDateOfBirth = new Date(dateofbirth);
      if (isNaN(parsedDateOfBirth.getTime())) {
        return sendErrorResponse(res, 400, "Invalid date of birth format.");
      }
      updatedData.dateofbirth = parsedDateOfBirth;
    }

    if (dateofjoining) {
      const parsedDateOfJoining = new Date(dateofjoining);
      if (isNaN(parsedDateOfJoining.getTime())) {
        return sendErrorResponse(res, 400, "Invalid date of joining format.");
      }
      updatedData.dateofjoining = parsedDateOfJoining;
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedEmployee) {
      return sendErrorResponse(res, 404, "Employee not found.");
    }

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (err) {
    console.error("Error updating employee:", err);
    sendErrorResponse(res, 500, "An error occurred while updating the employee.");
  }
};

module.exports = { addEmployee, updateEmployee };
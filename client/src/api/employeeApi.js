import axios from "axios";

// Define the base URL for your backend API
const BASE_URL = "http://localhost:5000/api/employee"; // Adjust the endpoint URL as needed

// Function to add an employee
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, employeeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentication if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Function to update an employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, employeeData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentication if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

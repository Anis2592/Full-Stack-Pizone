import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddEmployee({ setShowForm, selectedEmployee, fetchEmployees }) {
  const initialFormState = {
    name: "",
    emailId: "",
    jobTitle: "",
    city: "",
    state: "",
    paymentMethod: "",
    language: "",
    paidVacationDays: 0,
    paidSickDays: 0,
    dateOfBirth: "",
    dateOfJoining: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        ...selectedEmployee,
        dateOfBirth: selectedEmployee.dateOfBirth ? selectedEmployee.dateOfBirth.split("T")[0] : "",
        dateOfJoining: selectedEmployee.dateOfJoining ? selectedEmployee.dateOfJoining.split("T")[0] : "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paidVacationDays" || name === "paidSickDays" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : "",
      dateOfJoining: formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split("T")[0] : "",
    };

    console.log("🚀 Sending Data:", updatedFormData);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/employee`, updatedFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Employee Added Successfully:", response.data);

      // Check if setShowForm is a function before calling
      if (typeof setShowForm === "function") {
        setShowForm(false);
      } else {
        console.error("❌ setShowForm is not a function");
      }

      // Ensure fetchEmployees exists before calling
      if (typeof fetchEmployees === "function") {
        fetchEmployees(); // Refresh employee list
      } else {
        console.error("❌ fetchEmployees is not a function");
      }
      
    } catch (error) {
      console.error("❌ Error saving employee:", error.response ? error.response.data : error.message);
      alert(
        error.response
          ? `Error: ${JSON.stringify(error.response.data, null, 2)}`
          : "Error saving employee."
      );
    }
  };

  return (
    <div className="modal bg-white p-6 rounded shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">{selectedEmployee ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(initialFormState).map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              id={field}
              type={field.includes("date") ? "date" : field.includes("paid") ? "number" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={field}
            />
          </div>
        ))}
        <div className="flex justify-between space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            {selectedEmployee ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

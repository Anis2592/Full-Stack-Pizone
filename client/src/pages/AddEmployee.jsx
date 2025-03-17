import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddEmployee({ setShowForm, selectedEmployee, fetchEmployees }) {
  const initialFormState = {
    name: "",
    emailid: "",
    jobTitle: "",
    city: "",
    state: "",
    paymentMethod: "",
    language: "",
    paidVacationDays: "",
    paidSickDays: "",
    dateofbirth: "",
    dateofjoining: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Populate form when editing an existing employee
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        ...selectedEmployee,
        dateofbirth: selectedEmployee.dateofbirth ? selectedEmployee.dateofbirth.split("T")[0] : "",
        dateofjoining: selectedEmployee.dateofjoining ? selectedEmployee.dateofjoining.split("T")[0] : "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dates to ISO format before sending to backend
    const updatedFormData = {
      ...formData,
      dateofbirth: formData.dateofbirth ? new Date(formData.dateofbirth).toISOString() : null,
      dateofjoining: formData.dateofjoining ? new Date(formData.dateofjoining).toISOString() : null,
    };

    try {
      if (selectedEmployee) {
        await axios.put(`http://localhost:5000/api/employee/${selectedEmployee._id}`, updatedFormData);
      } else {
        await axios.post("http://localhost:5000/api/employee", updatedFormData);
      }

      setShowForm(false);
      fetchEmployees(); // Refresh employee list in Admin Panel
    } catch (error) {
      console.error("Error saving employee:", error);
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
              type={field.includes("date") ? "date" : "text"} // Use date input for date fields
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

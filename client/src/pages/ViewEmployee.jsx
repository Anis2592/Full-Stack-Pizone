import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams(); // ✅ Get employee ID from URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployee(response.data);
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!employee) return <p className="text-center">Employee not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Employee Details</h2>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.emailId}</p>
        <p><strong>Job Title:</strong> {employee.jobTitle}</p>
        <p><strong>City:</strong> {employee.city}</p>
        <p><strong>State:</strong> {employee.state}</p>
        <p><strong>Payment Method:</strong> {employee.paymentMethod}</p>
        <p><strong>Language:</strong> {employee.language}</p>
        <p><strong>Paid Vacation Days:</strong> {employee.paidVacationDays}</p>
        <p><strong>Paid Sick Days:</strong> {employee.paidSickDays}</p>
        <p><strong>Date of Birth:</strong> {new Date(employee.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Date of Joining:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>

        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 mt-4 rounded">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ViewEmployee;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaBriefcase, FaCity, FaMapMarkerAlt, FaMoneyBillWave, FaLanguage, FaCalendarAlt, FaArrowLeft } from "react-icons/fa"; // ✅ Import icons

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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!employee) return <p className="text-center text-gray-600">Employee not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">👤 Employee Details</h2>

        {/* Employee Info */}
        <div className="bg-gray-100 p-5 rounded-lg shadow-inner space-y-3">
          <p className="text-lg flex items-center gap-2"><FaUser className="text-blue-500" /> <strong>Name:</strong> {employee.name}</p>
          <p className="text-lg flex items-center gap-2"><FaEnvelope className="text-blue-500" /> <strong>Email:</strong> {employee.emailId || "N/A"}</p>
          <p className="text-lg flex items-center gap-2"><FaBriefcase className="text-blue-500" /> <strong>Job Title:</strong> {employee.jobTitle || "Not Assigned"}</p>
          <p className="text-lg flex items-center gap-2"><FaCity className="text-blue-500" /> <strong>City:</strong> {employee.city}</p>
          <p className="text-lg flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> <strong>State:</strong> {employee.state}</p>
          <p className="text-lg flex items-center gap-2"><FaMoneyBillWave className="text-blue-500" /> <strong>Payment Method:</strong> {employee.paymentMethod}</p>
          <p className="text-lg flex items-center gap-2"><FaLanguage className="text-blue-500" /> <strong>Language:</strong> {employee.language}</p>
          <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Paid Vacation Days:</strong> {employee.paidVacationDays}</p>
          <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Paid Sick Days:</strong> {employee.paidSickDays}</p>
          <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Date of Birth:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}</p>
          <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Date of Joining:</strong> {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : "N/A"}</p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-600 text-white font-semibold rounded-lg mt-6 transition duration-300 hover:bg-gray-700"
        >
          <FaArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
};

export default ViewEmployee;

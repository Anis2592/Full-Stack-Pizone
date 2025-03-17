import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/employee/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || !res.data.name) {
          throw new Error("Employee details not found.");
        }

        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(err.response?.data?.message || "Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Employee Dashboard</h1>

        <button
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="w-full py-2 bg-red-600 text-white rounded-lg mb-4"
        >
          Logout
        </button>

        {loading ? <p className="text-center">Loading...</p> : error ? <p className="text-center text-red-500">{error}</p> : (
          <div>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.emailid}</p>
            <p><strong>Job Title:</strong> {employee.jobTitle || "Not Assigned"}</p>
            <p><strong>City:</strong> {employee.city}</p>
            <p><strong>State:</strong> {employee.state}</p>
            <p><strong>Payment Method:</strong> {employee.paymentMethod}</p>
            <p><strong>Language:</strong> {employee.language}</p>
            <p><strong>Paid Vacation Days:</strong> {employee.paidVacationDays}</p>
            <p><strong>Paid Sick Days:</strong> {employee.paidSickDays}</p>
            <p><strong>Date of Birth:</strong> {new Date(employee.dateofbirth).toLocaleDateString()}</p>
            <p><strong>Date of Joining:</strong> {new Date(employee.dateofjoining).toLocaleDateString()}</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg mt-4"
              onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

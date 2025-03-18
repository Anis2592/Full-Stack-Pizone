 

import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showForm,setShowForm] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employee/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployees(res.data);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(employees.filter((emp) => emp._id !== id));
      alert("Employee deleted successfully! ✅");
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Dashboard</h1>

        <div className="flex justify-between mb-4">
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
          <Link to="/add-employee" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add Employee
          </Link>
        </div>

        {loading && <p className="text-center">Loading employees...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && employees.length === 0 && <p className="text-center">No employees found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee._id} className="bg-gray-50 p-5 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <p>{employee.jobTitle || "No Position"}</p>

              <div className="flex justify-between mt-3">
                <Link
                  to={`/view-employee/${employee._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View
                </Link>
                <Link
                  to={`/update-employee/${employee._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteEmployee(employee._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

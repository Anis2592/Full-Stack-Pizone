import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaSignOutAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("❌ Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employee/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdminName = async () => {
      try {
        if (!user || user.role !== "admin") {
          console.error("❌ Not an admin! Redirecting...");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setAdminName(res.data.name);
          console.log("✅ Fetched Admin Name:", res.data.name);
        }
      } catch (error) {
        console.error("❌ Error fetching admin details:", error);
      }
    };

    fetchEmployees();
    fetchAdminName();
  }, [token, user]);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((emp) => emp._id !== id));
      alert("✅ Employee deleted successfully!");
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <Sidebar userName={adminName} userRole="admin" />

      {/* ✅ Main Dashboard Content */}
      <div className="flex-1 p-6 bg-gray-100 sm:ml-64">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Admin Dashboard</h1>

          {/* ✅ Error & Loading States */}
          {loading && <p className="text-center text-gray-600 animate-pulse">Loading employees...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* ✅ Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {employees.map((employee) => (
              <div
                key={employee._id}
                className="bg-gray-50 p-5 shadow-md rounded-xl border border-gray-300 transition-all hover:scale-105 hover:shadow-xl"
              >
                <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
                <p className="text-gray-600">{employee.jobTitle || "No Position"}</p>

                {/* ✅ Action Buttons */}
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/view-employee/${employee._id}`}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                  >
                    <FaEye /> View
                  </Link>
                  <Link
                    to={`/update-employee/${employee._id}`}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => deleteEmployee(employee._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        </div>
      </div>
    
  );
};

export default AdminDashboard;





// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserPlus, FaSignOutAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa"; // ✅ Import icons

// const AdminDashboard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/employee/employees", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setEmployees(res.data);
//       } catch (err) {
//         setError("Failed to load employees. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const deleteEmployee = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this employee?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/employee/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setEmployees(employees.filter((emp) => emp._id !== id));
//       alert("✅ Employee deleted successfully!");
//     } catch (err) {
//       setError("Failed to delete employee.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 p-6 flex flex-col items-center">
//       <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-6"> Admin Dashboard</h1>

//         {/* Header Actions (Logout & Add Employee) */}
//         <div className="flex justify-between mb-6">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
//           >
//             <FaSignOutAlt /> Logout
//           </button>
//           <Link
//             to="/add-employee"
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:bg-blue-700"
//           >
//             <FaUserPlus /> Add Employee
//           </Link>
//         </div>

//         {/* Loading & Error Handling */}
//         {loading && <p className="text-center text-gray-600">Loading employees...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}

//         {/* No Employees Found */}
//         {!loading && employees.length === 0 && (
//           <p className="text-center text-gray-500">No employees found.</p>
//         )}

//         {/* Employee Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {employees.map((employee) => (
//             <div
//               key={employee._id}
//               className="bg-gray-50 p-5 shadow-md rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
//             >
//               <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
//               <p className="text-gray-600">{employee.jobTitle || "No Position"}</p>

//               {/* Action Buttons */}
//               <div className="flex justify-between mt-3">
//                 <Link
//                   to={`/view-employee/${employee._id}`}
//                   className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded transition hover:bg-blue-600"
//                 >
//                   <FaEye /> View
//                 </Link>
//                 <Link
//                   to={`/update-employee/${employee._id}`}
//                   className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded transition hover:bg-yellow-600"
//                 >
//                   <FaEdit /> Edit
//                 </Link>
//                 <button
//                   onClick={() => deleteEmployee(employee._id)}
//                   className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded transition hover:bg-red-600"
//                 >
//                   <FaTrash /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

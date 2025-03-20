import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaBriefcase, FaCity, FaMapMarkerAlt, FaMoneyBillWave, FaLanguage, FaCalendarAlt, FaSignOutAlt, FaEdit } from "react-icons/fa";

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
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <div className="w-72 bg-gray-900 text-white fixed h-full p-6 shadow-lg">
        <h2 className="text-2xl font-bold tracking-wide">Employee Panel</h2>
        <p className="mt-4 text-gray-300">Welcome, <span className="font-semibold text-white">{employee?.name}</span></p>
        <nav className="mt-8 space-y-4">
          <button 
            onClick={() => navigate("/employee-dashboard")} 
            className="block w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-blue-500 transition-all"
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="block w-full text-left py-3 px-4 rounded-lg bg-gray-800 hover:bg-red-600 transition-all"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 p-8 ml-72 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl transform transition hover:scale-105">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">👤 Employee Dashboard</h1>

          {/* ✅ Loading & Error Handling */}
          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">Loading employee details...</p>
          ) : error ? (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          ) : (
            <div className="space-y-6">
              {/* Employee Info (Left: Label | Right: Value) */}
              <div className="grid grid-cols-2 gap-6 bg-gray-100 p-6 rounded-2xl shadow-md border border-gray-300">
                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaUser className="text-blue-500" /> Name</p>
                <p className="text-gray-900">{employee.name}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaEnvelope className="text-blue-500" /> Email</p>
                <p className="text-gray-900">{employee.emailid || "N/A"}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaBriefcase className="text-blue-500" /> Job Title</p>
                <p className="text-gray-900">{employee.jobTitle || "Not Assigned"}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaCity className="text-blue-500" /> City</p>
                <p className="text-gray-900">{employee.city}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaMapMarkerAlt className="text-blue-500" /> State</p>
                <p className="text-gray-900">{employee.state}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaMoneyBillWave className="text-blue-500" /> Payment Method</p>
                <p className="text-gray-900">{employee.paymentMethod}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaLanguage className="text-blue-500" /> Language</p>
                <p className="text-gray-900">{employee.language}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaCalendarAlt className="text-blue-500" /> Paid Vacation Days</p>
                <p className="text-gray-900">{employee.paidVacationDays}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaCalendarAlt className="text-blue-500" /> Paid Sick Days</p>
                <p className="text-gray-900">{employee.paidSickDays}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaCalendarAlt className="text-blue-500" /> Date of Birth</p>
                <p className="text-gray-900">{employee.dateofbirth ? new Date(employee.dateofbirth).toLocaleDateString() : "Invalid Date"}</p>

                <p className="font-semibold flex items-center gap-2 text-gray-700"><FaCalendarAlt className="text-blue-500" /> Date of Joining</p>
                <p className="text-gray-900">{employee.dateofjoining ? new Date(employee.dateofjoining).toLocaleDateString() : "Invalid Date"}</p>
              </div>

              {/* Edit Profile Button */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-lg mt-4 transition duration-300 hover:bg-blue-700 hover:scale-105"
                onClick={() => navigate("/edit-profile")}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaEnvelope, FaBriefcase, FaCity, FaMapMarkerAlt, FaMoneyBillWave, FaLanguage, FaCalendarAlt, FaSignOutAlt, FaEdit } from "react-icons/fa"; // ✅ Icons

// const EmployeeDashboard = () => {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/employee/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.data || !res.data.name) {
//           throw new Error("Employee details not found.");
//         }

//         setEmployee(res.data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//         setError(err.response?.data?.message || "Failed to load employee data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployee();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">👤 Employee Dashboard</h1>

//         {/* Logout Button */}
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             navigate("/login");
//           }}
//           className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-lg mb-4 transition duration-300 hover:bg-red-700"
//         >
//           <FaSignOutAlt /> Logout
//         </button>

//         {/* Loading & Error Handling */}
//         {loading ? (
//           <p className="text-center text-gray-600">Loading...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <div className="space-y-4">
//             {/* Employee Info */}
//             <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
//               <p className="text-lg flex items-center gap-2"><FaUser className="text-blue-500" /> <strong>Name:</strong> {employee.name}</p>
//               <p className="text-lg flex items-center gap-2"><FaEnvelope className="text-blue-500" /> <strong>Email:</strong> {employee.emailid || "N/A"}</p>
//               <p className="text-lg flex items-center gap-2"><FaBriefcase className="text-blue-500" /> <strong>Job Title:</strong> {employee.jobTitle || "Not Assigned"}</p>
//               <p className="text-lg flex items-center gap-2"><FaCity className="text-blue-500" /> <strong>City:</strong> {employee.city}</p>
//               <p className="text-lg flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> <strong>State:</strong> {employee.state}</p>
//               <p className="text-lg flex items-center gap-2"><FaMoneyBillWave className="text-blue-500" /> <strong>Payment Method:</strong> {employee.paymentMethod}</p>
//               <p className="text-lg flex items-center gap-2"><FaLanguage className="text-blue-500" /> <strong>Language:</strong> {employee.language}</p>
//               <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Paid Vacation Days:</strong> {employee.paidVacationDays}</p>
//               <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Paid Sick Days:</strong> {employee.paidSickDays}</p>
//               <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Date of Birth:</strong> {employee.dateofbirth ? new Date(employee.dateofbirth).toLocaleDateString() : "N/A"}</p>
//               <p className="text-lg flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> <strong>Date of Joining:</strong> {employee.dateofjoining ? new Date(employee.dateofjoining).toLocaleDateString() : "N/A"}</p>
//             </div>

//             {/* Edit Profile Button */}
//             <button
//               className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg mt-4 transition duration-300 hover:bg-blue-700"
//               onClick={() => navigate("/edit-profile")}
//             >
//               <FaEdit /> Edit Profile
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployeeDashboard;

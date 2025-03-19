import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import ViewEmployee from "./pages/ViewEmployee";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
 

const token = localStorage.getItem("token");
let user = null;

if (token) {
  try {
    user = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  } catch (error) {
    console.error("❌ Invalid token:", error);
    localStorage.removeItem("token"); // Remove invalid token
  }
}

console.dir(user); // ✅ Debugging user object

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Role-Based Routes */}
        <Route
          path="/admin-dashboard"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/employee-dashboard"
          element={user?.role === "employee" ? <EmployeeDashboard /> : <Navigate to="/login" />}
        />
        <Route path="/update-employee/:id" element={user ? <UpdateEmployee /> : <Navigate to="/login" />} />
                <Route path="/view-employee/:id" element={user ? <ViewEmployee /> : <Navigate to="/login" />} />

        {/* ✅ Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
// const App = () => {
//   const [user, setUser] = useState(null); // ✅ Remove duplicate declaration

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT
//         console.log("🔑 Decoded JWT Payload:", decodedUser);
//         setUser(decodedUser);
//       } catch (error) {
//         console.error("❌ Invalid Token Format:", error);
//         localStorage.removeItem("token");
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login setUser={setUser} />} /> {/* ✅ Pass setUser */}
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/dashboard"
//           element={user ? (user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard user={user} />) : <Navigate to="/login" />}
//         />

//         <Route
//           path="/add-employee"
//           element={user?.role === "admin" ? <AddEmployee /> : <Navigate to="/dashboard" />}
//         />

//         <Route path="/update-employee/:id" element={user ? <UpdateEmployee /> : <Navigate to="/login" />} />
//         <Route path="/view-employee/:id" element={user ? <ViewEmployee /> : <Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import AdminDashboard from "./pages/AdminDashboard";
// import ViewEmployee from "./pages/ViewEmployee";
// import EmployeeDashboard from "./pages/EmployeeDashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AddEmployee from "./pages/AddEmployee";
// import UpdateEmployee from "./pages/UpdateEmployee";

// const App = () => {
//   const [user, setUser] = useState(null);

//   // ✅ Update user dynamically when token changes
//   const token = localStorage.getItem("token");
//   let user = null;
  
//   if (token) {
//     try {
//       const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
//       console.log("🔑 Decoded JWT Payload:", decoded); // ✅ Debugging JWT structure
//       user = decoded;
//     } catch (error) {
//       console.error("❌ Invalid Token Format:", error);
//       localStorage.removeItem("token");
//     }
//   }

//   console.dir(user); // ✅ Debugging user object

//   return (
//     <Router>
//       <Routes>
//         {/* ✅ Redirect to login if not authenticated */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* ✅ Public Routes */}
//         <Route path="/login" element={<Login setUser={setUser} />} /> {/* ✅ Pass setUser to Login */}
//         <Route path="/register" element={<Register />} />

//         {/* ✅ Role-Based Route: Admin vs Employee */}
//         <Route
//           path="/dashboard"
//           element={
//             user ? (user.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard user={user} />) : <Navigate to="/login" />
//           }
//         />

//         {/* ✅ Restrict Add Employee to Admin Only */}
//         <Route
//           path="/add-employee"
//           element={user?.role === "admin" ? <AddEmployee /> : <Navigate to="/dashboard" />}
//         />

//         {/* ✅ Restrict Update Employee to Logged-in Users */}
//         <Route path="/update-employee/:id" element={user ? <UpdateEmployee /> : <Navigate to="/login" />} />

//         {/* ✅ Employees can view details but must be logged in */}
//         <Route path="/view-employee/:id" element={user ? <ViewEmployee /> : <Navigate to="/login" />} />

//         {/* ✅ Catch-All Redirect */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import AdminDashboard from './pages/AdminDashboard';
// import ViewEmployee from './pages/ViewEmployee';
// import EmployeeDashboard from './pages/EmployeeDashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import AddEmployee from './pages/AddEmployee';
// import UpdateEmployee from './pages/UpdateEmployee';

// const App = () => {
//   const token = localStorage.getItem('token');
//   const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
//   console.dir(user);
  

//   return (
//     <Router>
//       <Routes>
//         {/* Root route */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Other routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
//         {/* Admin Route */}
//         <Route 
//           path="/dashboard" 
//           element={user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />} 
//         />
//         <Route path="/view-employee/:id" element={<ViewEmployee />} />
//         <Route 
//           path="/add-employee" 
//           element={user?.role === 'admin' ? <AddEmployee /> : <Navigate to="/dashboard" />} 
//         />
        
//         <Route 
//           path="/update-employee/:id" 
//           element={user ? <UpdateEmployee /> : <Navigate to="/login" />} 
//         />
        
//         {/* Wildcard route to handle unmatched paths */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

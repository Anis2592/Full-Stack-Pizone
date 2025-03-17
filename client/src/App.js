import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddEmployee from './pages/AddEmployee';
import UpdateEmployee from './pages/UpdateEmployee';

const App = () => {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  return (
    <Router>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Route */}
        <Route 
          path="/dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />} 
        />
        
        <Route 
          path="/add-employee" 
          element={user?.role === 'admin' ? <AddEmployee /> : <Navigate to="/dashboard" />} 
        />
        
        <Route 
          path="/update-employee/:id" 
          element={user ? <UpdateEmployee /> : <Navigate to="/login" />} 
        />
        
        {/* Wildcard route to handle unmatched paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

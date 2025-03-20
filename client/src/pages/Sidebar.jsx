import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUserPlus, FaUsers, FaSignOutAlt, FaHome } from "react-icons/fa";

const Sidebar = ({ userName, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">
      <div className="p-6 text-lg font-bold border-b border-gray-700">
        {userRole === "admin" ? "Admin Panel" : "Employee Panel"}
      </div>

      <div className="p-4 border-b border-gray-700">
        Welcome, <span className="font-semibold">{userName || "Admin"}</span>
      </div>

      <ul className="p-4 space-y-4">
        <li>
          <Link to={userRole === "admin" ? "/admin-dashboard" : "/employee-dashboard"} className="flex items-center gap-2 hover:text-gray-400">
            <FaHome /> Dashboard
          </Link>
        </li>

        {userRole === "admin" && (
          <>
            <li>
              <Link to="/add-employee" className="flex items-center gap-2 hover:text-gray-400">
                <FaUserPlus /> Add Employee
              </Link>
            </li>
            <li>
              <Link to="/manage-employees" className="flex items-center gap-2 hover:text-gray-400">
                <FaUsers /> Manage Employees
              </Link>
            </li>
          </>
        )}

        <li>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-gray-400">
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Decode token safely
import { FaSave, FaArrowLeft } from "react-icons/fa"; // ✅ Icons

const EditProfile = () => {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    emailid: "",
    jobTitle: "",
    city: "",
    state: "",
    paymentMethod: "",
    language: "",
    paidVacationDays: 0,
    paidSickDays: 0,
    dateofbirth: "",
    dateofjoining: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Decode JWT Token Safely
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
    const fetchEmployee = async () => {
      try {
        if (!user) return navigate("/login"); // ✅ Ensure user is logged in

        const res = await axios.get("http://localhost:5000/api/employee/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) throw new Error("Employee details not found.");

        setFormData({
          ...res.data,
          dateofbirth: res.data.dateofbirth ? res.data.dateofbirth.split("T")[0] : "",
          dateofjoining: res.data.dateofjoining ? res.data.dateofjoining.split("T")[0] : "",
        });
      } catch (err) {
        console.error("❌ Error fetching employee details:", err);
        setError("Failed to load employee data.");
      }
    };

    fetchEmployee();
  }, [navigate, token, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/employee/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Profile updated successfully!");
      navigate("/employee-dashboard");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">✏️ Edit Profile</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData)
            .filter((field) => !["_id", "__v", "createdAt", "updatedAt"].includes(field))
            .map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

          {/* Save & Back Buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md transition duration-200 hover:bg-blue-700 disabled:bg-gray-400"
            >
              <FaSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2 rounded-md transition duration-200 hover:bg-gray-700"
            >
              <FaArrowLeft /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

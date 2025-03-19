import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
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

        if (!res.data) throw new Error("Employee details not found.");

        setFormData({
          ...res.data,
          dateofbirth: res.data.dateofbirth ? res.data.dateofbirth.split("T")[0] : "",
          dateofjoining: res.data.dateofjoining ? res.data.dateofjoining.split("T")[0] : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/employee/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      navigate("/employee-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Edit Profile</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading ? <p className="text-center">Loading...</p> : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, " $1")}</label>
                <input
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg">
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button type="button" onClick={() => navigate("/employee-dashboard")}
              className="w-full py-2 bg-gray-500 text-white rounded-lg mt-2">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

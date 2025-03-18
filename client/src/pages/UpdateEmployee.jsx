import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    jobTitle: "",
    city: "",
    state: "",
    paymentMethod: "",
    language: "",
    paidVacationDays: 0,
    paidSickDays: 0,
    dateOfBirth: "",
    dateOfJoining: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Decode JWT token safely
  let user = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      user = decoded;
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Populate form fields with fetched employee data
        if (res.data) {
          setFormData({
            name: res.data.name || "",
            emailId: res.data.emailId || "",
            jobTitle: res.data.jobTitle || "",
            city: res.data.city || "",
            state: res.data.state || "",
            paymentMethod: res.data.paymentMethod || "",
            language: res.data.language || "",
            paidVacationDays: res.data.paidVacationDays || 0,
            paidSickDays: res.data.paidSickDays || 0,
            dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split("T")[0] : "",
            dateOfJoining: res.data.dateOfJoining ? res.data.dateOfJoining.split("T")[0] : "",
          });
        }
      } catch (err) {
        console.error("❌ Error fetching employee details:", err);
        setError("Could not fetch employee details.");
      }
    };

    if (user && (user.role === "admin" || user.userId === id)) {
      fetchEmployeeData();
    } else {
      navigate("/dashboard");
    }
  }, [id, navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/employee/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Employee updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      setError("Failed to update employee details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Edit Employee</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block text-gray-700">{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type={field.includes("date") ? "date" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;

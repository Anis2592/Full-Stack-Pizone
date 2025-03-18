const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests
 app.use("/api/auth", authRoutes); // Use the authentication routes
// Database connection
mongoose.connect('mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Use the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const authRoutes = require("./backend/routes/authRoutes");
const tenantRoutes = require("./backend/routes/tenantRoutes");

require("dotenv").config();

const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "frontend")));

// Route for the root URL to serve 'admin.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages", "admin.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

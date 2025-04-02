const express = require("express");
const cors = require("cors");
const authRoutes = require("./backend/routes/authRoutes");
const tenantRoutes = require("./backend/routes/tenantRoutes");
const analyticsRoutes = require("./backend/routes/analyticsRoutes");
const billingRoutes = require("./backend/routes/billingRoutes"); // Ensure this file defines appropriate routes

require("dotenv").config();

const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/billing", billingRoutes); // Consolidated billing routes under /api/billing

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, "frontend")));

// Route to serve 'login form'
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages", "login.html"));
});

// Route to serve 'dashboard'
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages", "admin.html"));
});

// Route to serve 'billing'
app.get("/billing.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages", "billing.html"));
});

// Route to serve 'analytics'
app.get("/analytics.html", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages", "analytics.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // Import body-parser
require("dotenv").config();

const app = express(); // Initialize 'app' before using it

// Middleware
app.use(cors());
app.use(express.json());

// Use JSON for API routes, raw body for webhooks
app.use(bodyParser.json());
app.use("/api/webhooks", bodyParser.raw({ type: "application/json" }));

// Import Routes
const authRoutes = require("./backend/routes/authRoutes");
const tenantRoutes = require("./backend/routes/tenantRoutes");
const orderRoutes = require("./backend/routes/orderRoutes");
const subscriptionRoutes = require("./backend/routes/subscriptionRoutes");
const webhookRoutes = require("./backend/routes/webhookRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/webhooks", webhookRoutes);






// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
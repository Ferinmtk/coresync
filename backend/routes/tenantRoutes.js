const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");

const router = express.Router();

// Only Super Admins can view all tenants
router.get("/", authMiddleware, rbacMiddleware(["super_admin"]), async (req, res) => {
    // Fetch all tenants from the database
    res.json({ message: "List of tenants." });
});

// Admins and Super Admins can create new tenants
router.post("/tenants", authMiddleware, rbacMiddleware(["super_admin", "admin"]), async (req, res) => {
    // Create a new tenant
    res.json({ message: "Tenant created successfully." });
});

module.exports = router;

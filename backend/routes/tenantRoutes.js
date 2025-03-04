const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Create a new Tenant
router.post("/register", async (req, res) => {
    const { name, adminName, adminEmail, adminPassword } = req.body;

    try {
        // Create Tenant
        const tenantResult = await pool.query(
            "INSERT INTO tenants (name) VALUES ($1) RETURNING id",
            [name]
        );
        const tenantId = tenantResult.rows[0].id;

        // Hash password
        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create Admin User for Tenant
        const userResult = await pool.query(
            "INSERT INTO users (name, email, password_hash, role, tenant_id) VALUES ($1, $2, $3, 'Admin', $4) RETURNING *",
            [adminName, adminEmail, hashedPassword, tenantId]
        );

        res.status(201).json({ message: "Tenant created successfully", tenant: tenantResult.rows[0], admin: userResult.rows[0] });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all Tenants (Only SuperAdmin can view)
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
// Get all Tenants (Only SuperAdmin)
router.get("/", authenticateUser, authorizeRole(["SuperAdmin"]), async (req, res) => {
    try {
        const tenants = await pool.query("SELECT * FROM tenants");
        res.json(tenants.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;

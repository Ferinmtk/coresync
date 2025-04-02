const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const Tenant = require("../models/tenantModel"); // Assuming Tenant is your database model
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Only Super Admins can view all tenants
router.get("/", authMiddleware, rbacMiddleware(["SuperAdmin"]), async (req, res) => {
    try {
        const tenants = await Tenant.findAll(); // Fetch all tenants from the database
        res.status(200).json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch tenants." });
    }
});


// Create a tenant
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, schema_name } = req.body;
        const newTenant = await Tenant.create({ name, schema_name });
        res.status(201).json(newTenant);
    } catch (error) {
        console.error("Error creating tenant:", error);
        res.status(500).json({ message: "Failed to create tenant." });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params; // Extract tenant ID from URL
        const deleted = await Tenant.destroy({ where: { id } }); // Remove tenant from database
        if (!deleted) {
            return res.status(404).json({ message: "Tenant not found." });
        }
        res.status(200).json({ message: "Tenant deleted successfully." });
    } catch (error) {
        console.error("Error deleting tenant:", error);
        res.status(500).json({ message: "Failed to delete tenant." });
    }
});

module.exports = router;

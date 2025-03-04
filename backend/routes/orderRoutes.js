const express = require("express");
const pool = require("../config/db");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Order (Only for the Tenant)
router.post("/", authenticateUser, async (req, res) => {
    const { product_name, amount } = req.body;
    const tenantId = req.user.tenantId;

    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (tenant_id, product_name, amount) VALUES ($1, $2, $3) RETURNING *",
            [tenantId, product_name, amount]
        );
        res.status(201).json(newOrder.rows[0]);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Orders (Only for the Tenant)
router.get("/", authenticateUser, async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const orders = await pool.query("SELECT * FROM orders WHERE tenant_id = $1", [tenantId]);
        res.json(orders.rows);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

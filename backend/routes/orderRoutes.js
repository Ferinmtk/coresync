const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const { Order } = require("../models/orderModel");
const { body, validationResult, query } = require("express-validator");

const router = express.Router();

/**
 * Get orders (Only for the current tenant)
 * Supports pagination through 'page' and 'limit' query parameters.
 */
router.get(
    "/",
    authMiddleware,
    tenantMiddleware,
    [
        // Validate pagination query parameters
        query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
        query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            const orders = await Order.findAll({
                where: { tenant_id: req.tenant_id },
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
            res.json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).json({ error: "An error occurred while fetching orders." });
        }
    }
);

/**
 * Create a new order (Only within the tenant, restricted by roles)
 * Validates the request body for required fields.
 */
router.post(
    "/",
    authMiddleware,
    tenantMiddleware,
    rbacMiddleware(["manager", "admin"]),
    [
        // Validate request body fields
        body("product").notEmpty().withMessage("Product is required."),
        body("amount")
            .isFloat({ gt: 0 })
            .withMessage("Amount must be a positive number."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { product, amount } = req.body;
            const newOrder = await Order.create({
                tenant_id: req.tenant_id,
                user_id: req.user.id,
                product,
                amount,
            });
            res.status(201).json(newOrder);
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ error: "An error occurred while creating the order." });
        }
    }
);

module.exports = router;

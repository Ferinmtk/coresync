const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("../config/db");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Prices from Stripe Dashboard
const PRICING_PLANS = {
    Free: "price_1QtwTPCdSu8ieIKUxGa4JhVZ", //  actual Price ID
    Pro: "price_1QtwW1CdSu8ieIKUAg49rPDo",  // actual Price ID
    Enterprise: "price_1QtwYqCdSu8ieIKUv2wftywo" // actual Price ID
};

//  Stripe Checkout Session
router.post("/checkout", authenticateUser, async (req, res) => {
    const { plan } = req.body;
    const tenantId = req.user.tenantId;
    const email = req.user.email;

    try {
        // Validate plan
        if (!PRICING_PLANS[plan]) {
            return res.status(400).json({ message: "Invalid plan selected" });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            mode: "subscription",
            line_items: [
                {
                    price: PRICING_PLANS[plan],
                    quantity: 1
                }
            ],
            success_url: `${process.env.CLIENT_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/billing/cancel`
        });

        // Store Subscription Session ID in DB
        await pool.query(
            "UPDATE tenants SET stripe_session_id = $1 WHERE id = $2",
            [session.id, tenantId]
        );

        res.json({ sessionId: session.id });

    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ message: "Error creating Stripe session", error: error.message });
    }
});
// Retrieve Stripe Session Information (GET method)
router.get("/checkout/:sessionId", authenticateUser, async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({ session });

    } catch (error) {
        console.error("Error retrieving Stripe session:", error);
        res.status(500).json({ message: "Error retrieving Stripe session", error: error.message });
    }
});

// Get current subscription status
router.get("/status", authenticateUser, async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const result = await pool.query("SELECT subscription_status FROM tenants WHERE id = $1", [tenantId]);

        if (result.rows.length > 0) {
            res.json({ plan: result.rows[0].subscription_status });
        } else {
            res.json({ plan: "None" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching subscription status" });
    }
});

// Cancel subscription
router.post("/cancel", authenticateUser, async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        // Get Stripe subscription ID
        const result = await pool.query("SELECT stripe_subscription_id FROM tenants WHERE id = $1", [tenantId]);
        const subscriptionId = result.rows[0]?.stripe_subscription_id;

        if (!subscriptionId) {
            return res.status(400).json({ message: "No active subscription found." });
        }

        // Cancel subscription in Stripe
        await stripe.subscriptions.del(subscriptionId);

        // Update tenant's status
        await pool.query("UPDATE tenants SET subscription_status = 'canceled' WHERE id = $1", [tenantId]);

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error canceling subscription" });
    }
});

// Add Test Route
router.get("/test", (req, res) => {
    res.send("Test route is working!");
});

module.exports = router;

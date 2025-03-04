const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("../config/db");

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // Update Tenant Subscription Status
            await pool.query(
                "UPDATE tenants SET stripe_subscription_id = $1, subscription_status = 'active' WHERE stripe_session_id = $2",
                [session.subscription, session.id]
            );

            console.log("✅ Subscription activated:", session.customer_email);
        }

        if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;

            // Cancel the tenant's subscription
            await pool.query(
                "UPDATE tenants SET subscription_status = 'canceled' WHERE stripe_subscription_id = $1",
                [subscription.id]
            );

            console.log("⚠️ Subscription canceled:", subscription.id);
        }

        res.json({ received: true });

    } catch (error) {
        console.error("⚠️ Webhook Error:", error.message);
        res.status(400).json({ message: "Webhook error" });
    }
});

module.exports = router;

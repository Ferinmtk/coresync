const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/subscriptionModel");

exports.subscribePlan = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user.id;

        const priceId = plan === "basic" ? "price_basic" : "price_pro"; 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: req.user.email,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.FRONTEND_URL}/billing.html?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/billing.html?canceled=true`,
        });

        await Subscription.create({ userId, plan, stripeSessionId: session.id });

        res.json({ message: "Redirecting to payment...", url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscription = await Subscription.findOne({ userId });

        res.json({ plan: subscription ? subscription.plan : "None" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        await Subscription.deleteOne({ userId });

        res.json({ message: "Subscription canceled successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

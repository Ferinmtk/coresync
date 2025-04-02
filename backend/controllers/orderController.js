const { updateAnalytics } = require("./analyticsController");

exports.createOrder = async (req, res) => {
    try {
        const { tenant_id, user_id, total_price } = req.body;

        const newOrder = await Order.create({ tenant_id, user_id, total_price });

        // 🔄 Update analytics after new order
        await updateAnalytics(tenant_id);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
};

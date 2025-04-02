const Analytics = require("../models/analyticsModel");
const Order = require("../models/orderModel");

exports.updateAnalytics = async (tenant_id) => {
    try {
        const totalOrders = await Order.count({ where: { tenant_id } });
        const revenue = await Order.sum("total_price", { where: { tenant_id } });
        const activeUsers = Math.floor(Math.random() * 100); // Simulated user activity

        await Analytics.upsert({ tenant_id, total_orders: totalOrders, revenue, active_users: activeUsers });
    } catch (error) {
        console.error("Error updating analytics:", error);
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const analytics = await Analytics.findOne({ where: { tenant_id } });

        if (!analytics) return res.status(404).json({ message: "No data available." });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics data" });
    }
};

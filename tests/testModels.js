require("dotenv").config();
const sequelize = require("../backend/config/db"); // Import Sequelize instance
const { User, Tenant, Order, Subscription } = require("../backend/models"); // Import models

(async () => {
    try {
        console.log(" DB Config Loaded: Path Resolved");

        // Create a new tenant
        const tenant = await Tenant.create({ name: "COressy Company" });
        console.log(" Tenant Created:", tenant.toJSON());

        console.log(" User Data:", {
            tenant_id: tenant.id,
            name: "James Kimani",
            email: "kimanie@gmail.com",
            password: "securepassword",
            role: "Admin",
        });

        // Create a user under this tenant
        const user = await User.create({
            tenant_id: tenant.id,
            name: "James",
            email: "james" + Date.now() + "@gmail.com", // Generates a unique email
            password: "securepassword", // Use a hashed password in production!
            role: "Admin"
        });
        console.log(" User Created:", user.toJSON());

        // Create an order
        const order = await Order.create({
            tenant_id: tenant.id,
            user_id: user.id,
            product_name: "Software License",
            amount: 99.99,
            status: "pending"
        });
        console.log(" Order Created:", order.toJSON());

        // Create a subscription
        const subscription = await Subscription.create({
            tenant_id: tenant.id,
            plan: "Pro",
            status: "Active",
            end_date: new Date("2025-12-31")
        });
        console.log(" Subscription Created:", subscription.toJSON());

        // All tests passed!
        console.log("\n All tests ran successfully! ");
    } catch (error) {
        console.error("\n Error during tests:", error.message || error);
    } finally {
        try {
            await sequelize.close(); // Close the database connection
            console.log(" Sequelize connection closed.");
        } catch (closeErr) {
            console.error(" Error closing Sequelize connection:", closeErr);
        }
    }
})();

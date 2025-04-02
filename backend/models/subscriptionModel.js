const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Subscription = sequelize.define('Subscription', {
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Tenants', // Assuming a Tenants table exists
            key: 'id',
        },
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Free', 'Pro', 'Enterprise']], // Matches database constraint
        },
        defaultValue: 'Free', // Default plan for new subscriptions
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Active', 'Cancelled', 'Expired']], // Matches database constraint
        },
        defaultValue: 'Active', // Default status for new subscriptions
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isFuture(value) {
                if (new Date(value) <= new Date()) {
                    throw new Error('End date must be in the future');
                }
            },
        },
    },
}, {
    tableName: 'subscriptions',
    timestamps: true, // Automatically adds createdAt and updatedAt
    createdAt: 'created_at', // Map Sequelize's createdAt to created_at
    updatedAt: 'updated_at', // Enable updatedAt and map it
    indexes: [
        { fields: ['tenant_id'] }, // Index for quicker tenant lookups
    ],
});

const subscribePlan = async (req, res) => {
    try {
        const { tenant_id, plan, end_date } = req.body;

        // Validate input data
        if (!tenant_id || !["Free", "Pro", "Enterprise"].includes(plan) || !end_date) {
            return res.status(400).json({ error: "Invalid subscription data" });
        }

        // Create subscription record in the database
        const subscription = await Subscription.create({
            tenant_id,
            plan,
            status: "Active",
            end_date,
        });

        res.status(201).json({ success: true, subscription });
    } catch (error) {
        console.error("Error in subscribePlan:", error);
        res.status(500).json({ error: "Failed to create subscription" });
    }
};

module.exports = Subscription;

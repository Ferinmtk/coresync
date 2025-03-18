const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Subscription = sequelize.define('Subscription', {
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Free', 'Pro', 'Enterprise']], // Matches database constraint
        },
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Active', 'Cancelled', 'Expired']], // Matches database constraint
        },
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'subscriptions',
    timestamps: true, // Automatically adds createdAt and updatedAt
    createdAt: 'created_at', // Map Sequelize's createdAt to created_at
    updatedAt: false, // Disable updatedAt since it's not in the schema
});

module.exports = Subscription;

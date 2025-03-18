const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Order = sequelize.define('Order', {
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false, // This is a foreign key for the Tenant table
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false, // This is a foreign key for the User table
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false, // Enforce that a status value is required
        validate: {
            isIn: [['pending', 'completed', 'canceled']], // Match database constraints
        },
    },
}, {
    tableName: 'orders', // Explicitly name the table
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    createdAt: 'order_date', // Maps Sequelize's createdAt to order_date in your schema
    updatedAt: false, // Disable updatedAt since it's not in the schema
});

module.exports = Order;

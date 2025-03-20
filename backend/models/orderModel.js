const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: "Unique identifier for each order",
    },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "Multi-Tenancy key for logical data isolation",
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "Foreign key referencing the User table",
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Name or identifier of the product",
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Total amount for the order (monetary value)",
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "canceled"),
        allowNull: false,
        defaultValue: "pending",
        comment: "Status of the order",
    },
}, {
    tableName: "orders",
    timestamps: true,
    createdAt: "order_date",
    updatedAt: "last_updated",
});

module.exports = Order;

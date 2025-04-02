const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/db");

const Analytics = db.define("Analytics", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    total_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    revenue: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    active_users: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

module.exports = Analytics;

const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

// Define the Tenant model
const Tenant = sequelize.define('Tenant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
    tableName: 'tenants', // Explicitly use the lowercase table name
});

module.exports = Tenant;

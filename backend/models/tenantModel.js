const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

// Define the Tenant model
const Tenant = sequelize.define('Tenant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true, 
    tableName: 'tenants',
});

module.exports = Tenant;

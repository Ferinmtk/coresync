const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const User = sequelize.define('User', {
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

// Add findByEmail method
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
};

module.exports = User;

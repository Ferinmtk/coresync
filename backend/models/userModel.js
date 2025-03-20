const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const User = sequelize.define('User', {
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: "Multi-Tenancy key for logical data partition",
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    role: {
        type: DataTypes.ENUM("super_admin", "admin", "manager", "employee"),
        allowNull: false,
        defaultValue: "employee",
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

//  custom static method for finding users by email
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
};

// Add a custom method for checking permissions
User.prototype.hasRole = function(role) {
    return this.role === role;
};

module.exports = User;

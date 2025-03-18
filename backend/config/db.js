const { Sequelize } = require('sequelize');
require('dotenv').config();


const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
});

sequelize.authenticate()
    .then(() => console.log("✅ PostgreSQL Connected via Sequelize"))
    .catch(err => console.error("❌ Database Connection Error via Sequelize:", err));

   

module.exports = sequelize;
console.log("✅ DB Config Loaded: Path Resolved");


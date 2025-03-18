const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Tenant } = require("../models");
require("dotenv").config();




class AuthController {
    static async register(req, res) {
        try {
            const { tenant_name, name, email, password, role } = req.body;

            // Check if the email is already in use
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered." });
            }

            // Create a new tenant
            const tenant = await Tenant.create({ name: tenant_name });

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const user = await User.create({
                tenant_id: tenant.id,
                name,
                email,
                password: hashedPassword,
                role
            });

            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({ message: "User registered successfully.", token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error." });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({ message: "Login successful.", token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error." });
        }
    }
}

module.exports = AuthController;

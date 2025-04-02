const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post(
    "/register",
    [
        body("tenant_name").notEmpty().withMessage("Tenant name is required."),
        body("name").notEmpty().withMessage("Name is required."),
        body("email").isEmail().withMessage("Valid email is required."),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
        body("role").optional().isIn(["SuperAdmin", "Manager", "Employee"]).withMessage("Invalid role.")
    ],
    AuthController.register
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required."),
        body("password").notEmpty().withMessage("Password is required.")
    ],
    AuthController.login
);

module.exports = router;

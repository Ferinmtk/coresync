const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/tenants", authMiddleware, rbacMiddleware("superadmin"), adminController.getAllTenants);
router.post("/tenants", authMiddleware, rbacMiddleware("superadmin"), adminController.createTenant);
router.delete("/tenants/:id", authMiddleware, rbacMiddleware("superadmin"), adminController.deleteTenant);

module.exports = router;

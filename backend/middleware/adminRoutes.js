const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/tenants", authMiddleware, rbacMiddleware("SuperAdmin"), adminController.getAllTenants);
router.post("/tenants", authMiddleware, rbacMiddleware("SuperAdmin"), adminController.createTenant);
router.delete("/tenants/:id", authMiddleware, rbacMiddleware("SuperAdmin"), adminController.deleteTenant);

module.exports = router;

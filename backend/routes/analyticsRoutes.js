const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/dashboard", authMiddleware, analyticsController.getAnalytics);

module.exports = router;

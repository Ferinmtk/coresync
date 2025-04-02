const express = require("express");
const router = express.Router();
const { subscribePlan, getSubscription, cancelSubscription } = require("../controllers/billingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/subscribe", authMiddleware, subscribePlan);
router.get("/subscription", authMiddleware, getSubscription);
router.post("/cancel", authMiddleware, cancelSubscription);

module.exports = router;

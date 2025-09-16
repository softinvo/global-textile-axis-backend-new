const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/admin/buyer.controller");
const { isAdminAuth } = require("../middlewares/authentication");

router.get("/admin/buyers", isAdminAuth, buyerController.getBuyers);

module.exports = router;

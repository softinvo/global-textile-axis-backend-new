const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin/auth.controller");
const { isAdminAuth } = require("../middlewares/authentication");

router.post("/admin/signup", adminAuthController.adminSignup);
router.post("/admin/login", adminAuthController.adminLogin);

module.exports = router;

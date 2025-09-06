const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { isBuyerAuth } = require("../middlewares/authentication");

//#########################################################################################
// ##############################  User App Api  ########################################
// #########################################################################################

router.post("/user/sendotp", authController.sendOtpUser);
router.post("/user/loginphone", authController.loginWithPhone);

// #########################################################################################
// ##############################  Admin Flow Api  ########################################
// #########################################################################################

module.exports = router;

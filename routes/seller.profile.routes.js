const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller/seller.controller");
const { isSellerAuth } = require("../middlewares/authentication");

// Profile
router.get("/seller/profile", isSellerAuth, sellerController.viewProfile);
router.put("/seller/profile", isSellerAuth, sellerController.editProfile);

module.exports = router;

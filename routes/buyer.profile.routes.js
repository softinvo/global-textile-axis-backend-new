const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyer/profile.controller");
const { isBuyerAuth } = require("../middlewares/authentication");

// Profile
router.get("/buyer/profile", isBuyerAuth, buyerController.viewProfile);
router.put("/buyer/profile", isBuyerAuth, buyerController.editProfile);

// Address management
router.post("/buyer/address/add", isBuyerAuth, buyerController.addAddress);
router.delete(
  "/buyer/address/:addressId",
  isBuyerAuth,
  buyerController.removeAddress
);
router.get("/buyer/address", isBuyerAuth, buyerController.viewAddresses);

module.exports = router;

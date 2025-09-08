const Seller = require("../../models/seller.model");
const Address = require("../../models/address.model");
const mongoose = require("mongoose");
const { addressSchema } = require("../../schemaValidator/address.validator");

const viewProfile = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.userId);

    const sellerProfile = await Seller.aggregate([
      {
        $match: { _id: sellerId }, // match logged-in seller
      },
      {
        $project: {
          name: 1,
          phone: 1,
          email: 1,
          gender: 1,
          profileStatus: 1,
          documentInfo: 1,
          addresses: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!sellerProfile || sellerProfile.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched seller profile",
      data: sellerProfile[0], // since it's an array
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Edit Profile
const editProfile = async (req, res) => {
  try {
    const { name, phone, email, gender } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.userId,
      { name, phone, email, gender },
      { new: true }
    );

    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  viewProfile,
  editProfile,
};

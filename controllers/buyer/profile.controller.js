const Buyer = require("../../models/buyer.model");
const Address = require("../../models/address.model");
const mongoose = require("mongoose");
const { addressSchema } = require("../../schemaValidator/address.validator");

const viewProfile = async (req, res) => {
  try {
    const buyerId = new mongoose.Types.ObjectId(req.userId);

    const buyerProfile = await Buyer.aggregate([
      {
        $match: { _id: buyerId }, // match logged-in buyer
      },
      {
        $lookup: {
          from: "addresses", // collection name in MongoDB
          localField: "addresses",
          foreignField: "_id",
          as: "addresses",
        },
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

    if (!buyerProfile || buyerProfile.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched buyer profile",
      data: buyerProfile[0], // since it's an array
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

    const buyer = await Buyer.findByIdAndUpdate(
      req.userId,
      { name, phone, email, gender },
      { new: true }
    );

    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });
    }

    res.status(200).json({ success: true, buyer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add Address
const addAddress = async (req, res) => {
  try {
    const buyerId = req.userId; // from middleware after auth
    const validateReqBody = await addressSchema.validateAsync(req.body);
    const {
      isPrimary,
      address,
      locality,
      landmark,
      geolocation,
      pincode,
      state,
      country,
      formattedAddress,
      name,
      phoneNumber,
    } = validateReqBody;

    // 1️⃣ Create new address
    const newAddress = new Address({
      isPrimary,
      address,
      locality,
      landmark,
      geolocation,
      pincode,
      state,
      country,
      formattedAddress,
      name,
      phoneNumber,
    });

    await newAddress.save();

    // 2️⃣ Link address to buyer
    await Buyer.findByIdAndUpdate(buyerId, {
      $addToSet: { addresses: newAddress._id },
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// Remove Address
const removeAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const buyer = await Buyer.findById(req.userId);

    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });
    }

    buyer.addresses = buyer.addresses.filter(
      (id) => id.toString() !== addressId
    );
    await buyer.save();

    return res.status(200).json({
      success: true,
      message: "Address removed successfully",
      addresses: buyer.addresses,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

// View Addresses
const viewAddresses = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.userId).populate("addresses");
    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: "Buyer not found" });
    }
    return res.status(200).json({ success: true, addresses: buyer.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  viewProfile,
  editProfile,
  addAddress,
  removeAddress,
  viewAddresses,
};

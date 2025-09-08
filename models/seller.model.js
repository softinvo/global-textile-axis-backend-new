const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String },
    email: { type: String },
    company: { type: String },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    phone: { type: String },
    profileStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Business Information
    businessName: { type: String, required: true },
    businessRegistrationDate: { type: Date },
    businessType: {
      type: String,
      enum: ["wholeseller", "retailer", "manufacturer", "designer", "service"],
      required: true,
    },
    businessRegistrationNumber: { type: String },
    gstNumber: { type: String },

    businessAddress: {
      line1: { type: String },
      line2: { type: String },
      pincode: { type: String },
      geolocation: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number], // [lng, lat]
        },
      },
    },

    // Banking details
    accountHolderName: { type: String },
    accountType: { type: String, enum: ["savings", "current"] },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    panCardNumber: { type: String },
    gstNumber: { type: String },
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

sellerSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      userType: "seller",
      phone: this.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRE,
    }
  );
};
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;

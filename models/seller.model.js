const mongoose = require("mongoose");
const documentSchema = require("./helpers/document.model");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String },
    email: { type: String },
    company: { type: String },
    phone: { type: String },
    profileStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Business Information
    businessName: { type: String },
    businessType: {
      type: String,
      enum: ["wholeseller", "retailer", "manufacturer", "designer", "service"],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    documents: [documentSchema],

    // Banking details
    accountHolderName: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
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

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    company: { type: String },
    address: { type: String },
    phone: { type: String },
    profile_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    businessName: { type: String },
    businessRegistrationDate: { type: Date }, // can be Date if you prefer
    typesOfBusiness: {
      type: String,
      enum: ["wholeseller", "retailer", "manufacturer", "designer"],
      required: true,
    },
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
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRE,
    }
  );
};
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;

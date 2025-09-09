const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const buyerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  profileStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  documentInfo: {
    nameAsPerRecords: { type: String },
    dob: { type: Date },
    addressAsPerRecords: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
  },

  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

buyerSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      userType: "buyer",
      phone: this.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRE,
    }
  );
};
const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;

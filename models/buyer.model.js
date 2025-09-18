const mongoose = require("mongoose");
const attachmentSchema = require("./helpers/attachment.model");
const jwt = require("jsonwebtoken");

const buyerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  email: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  avatar: { type: attachmentSchema },
  profileStatus: {
    type: String,
    enum: ["active", "inactive", "suspended", "deleted"],
    default: "active",
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

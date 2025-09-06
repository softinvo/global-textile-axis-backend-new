const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const buyerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  //   addresses: [],
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
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRE,
    }
  );
};
const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;

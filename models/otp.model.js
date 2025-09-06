const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otpType: {
    type: String,
    enum: ["login", "forgotPassword", "verify"],
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
  userType: {
    type: String,
    enum: ["buyer", "seller"],
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;

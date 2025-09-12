const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const adminSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  type: {
    type: String,
    enum: ["admin", "superadmin"],
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  address: {
    type: String,
  },
  resetToken: {
    type: String,
    trim: true,
  },
  resetTokenExpiry: {
    type: Date,
  },
});

adminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.JWT_ADMIN_SECRET,
    {
      expiresIn: process.env.JWT_ADMIN_SECRET_EXPIRE,
    }
  );
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

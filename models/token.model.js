const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  objectDocId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
  },
  userType: {
    type: String,
    required: true,
    enum: ["buyer", "seller", "admin"],
  },
  token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  expired_at: {
    type: Date,
    expires: 0,
  },
});

module.exports = mongoose.model("Token", tokenSchema);

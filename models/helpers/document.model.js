const mongoose = require("mongoose");
const attachmentSchema = require("./attachment.model");
const jwt = require("jsonwebtoken");

const documentSchema = new mongoose.Schema(
  {
    docType: {
      type: String,
      required: true, // e.g., "PAN", "GST", "Business License", "Address Proof"
    },
    docNumber: {
      type: String, // PAN number, GSTIN, license no, etc.
    },
    docImage: {
      type: attachmentSchema,
    },
    issuedBy: { type: String }, // optional, e.g., Govt. of India
    expiryDate: { type: Date }, // optional for licenses
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: { type: String }, // admin can add notes if rejected
  },
  { _id: false, timestamps: true }
);

module.exports = documentSchema;

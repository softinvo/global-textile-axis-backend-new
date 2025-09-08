const mongoose = require("mongoose");
const attachmentSchema = require("./helpers/attachment.model");

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["Buyer", "Seller", "Admin"],
    required: true,
  },
  senderDocId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "sender",
  },
  text: {
    type: String,
  },
  attachments: [
    {
      type: attachmentSchema,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const complaintSchema = new mongoose.Schema({
  complaintID: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  orderNumber: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  attachments: [
    {
      type: attachmentSchema,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Resolved", "On Hold", "Closed"],
    default: "Pending",
  },
  sellerDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },
  buyerDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;

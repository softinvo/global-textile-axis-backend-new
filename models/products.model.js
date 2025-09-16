const mongoose = require("mongoose");
const attachmentSchema = require("./helpers/attachment.model");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    // --- Common fields ---
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true, // e.g. "Fabric", "Garment", "Yarn", "Accessory"
    },
    subCategory: { type: String, trim: true },
    description: {
      short: { type: String, trim: true },
      long: { type: String, trim: true },
    },

    brand: { type: String, trim: true },
    countryOfOrigin: { type: String, trim: true },
    preview: [
      {
        type: attachmentSchema,
      },
    ],
    thumbnail: {
      type: attachmentSchema,
    },

    // --- Commercial details ---
    unit: { type: String, required: true }, // pcs, m, kg
    price: {
      value: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      minPrice: Number, 
      maxPrice: Number,
    },
    moq: { type: Number, default: 1 }, // minimum order quantity
    sampleAvailable: { type: Boolean, default: false },
    sampleCost: { type: Number },
    availability: {
      inStock: { type: Boolean, default: true },
      quantity: { type: Number, default: 0 }, // current stock
    },

    // --- Ratings ---
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    // --- Status ---
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "active",
    },

    // --- Admin fields ---
    createdBy: { type: String }, // system/admin/user
    verified: { type: Boolean, default: false }, // admin verified product
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

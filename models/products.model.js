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
    sku: { type: String, trim: true, index: true },
    modelNumber: { type: String, trim: true }, // useful for machinery
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
      currency: { type: String, default: "USD" },
      basis: {
        type: String,
        enum: ["FOB", "CIF", "EXW", "DDP"],
        default: "FOB",
      },
      minPrice: Number, // for negotiable range
      maxPrice: Number,
    },
    moq: { type: Number, default: 1 }, // minimum order quantity
    sampleAvailable: { type: Boolean, default: false },
    sampleCost: { type: Number },
    leadTime: { type: String }, // e.g. "30 days"
    capacityPerMonth: { type: Number },
    availability: {
      inStock: { type: Boolean, default: true },
      quantity: { type: Number, default: 0 }, // current stock
    },

    // --- Packaging & shipping ---
    packaging: {
      unitPerCarton: Number,
      cartonDimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      grossWeight: Number,
      netWeight: Number,
      palletInfo: String, // e.g. "10 cartons per pallet"
    },
    shipping: {
      incoterms: String,
      port: String,
      deliveryOptions: [String], // e.g. ["Air", "Sea", "Courier"]
    },

    // --- Compliance ---
    certifications: [String], // ["GOTS", "OEKO-TEX"]
    documents: [
      {
        name: String,
        url: String, // PDF, test reports, MSDS
      },
    ],
    warranty: { type: String }, // useful for machinery
    returnPolicy: { type: String },

    // --- Flexible category-specific fields ---
    specifications: {
      type: mongoose.Schema.Types.Mixed, // JSON object
      default: {},
    },

    // --- Marketing & SEO ---
    keywords: [String], // search optimization
    tags: [String], // internal labels
    highlights: [String], // bullet points for product card
    featured: { type: Boolean, default: false },

    // --- Ratings & reviews (aggregated) ---
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

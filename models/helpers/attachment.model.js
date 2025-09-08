const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true }, // path / s3 url
    fileName: { type: String }, // original filename
    fileType: { type: String }, // e.g. image/png, application/pdf
    fileExtension: { type: String }, // e.g. .png, .pdf, .docx
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

module.exports = attachmentSchema;

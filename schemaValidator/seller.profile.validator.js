const Joi = require("joi");

const addressSchema = Joi.object({
  isPrimary: Joi.boolean().default(false),
  address: Joi.string().optional(),
  locality: Joi.string().optional(),
  landmark: Joi.string().optional(),
  geolocation: Joi.object({
    type: Joi.string().valid("Point").default("Point"),
    coordinates: Joi.array()
      .items(Joi.number().required())
      .length(2) // [longitude, latitude]
      .required(),
  }).optional(),
  pincode: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  formattedAddress: Joi.string().optional(),
  name: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
});

const documentSchema = Joi.object({
  docType: Joi.string().required(),
  docNumber: Joi.string().optional(),
  issuedBy: Joi.string().optional(),
  expiryDate: Joi.date().optional(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),
  remarks: Joi.string().optional(),
  docImage: Joi.object({
    fileUrl: Joi.string().uri().required(),
    fileName: Joi.string().optional(),
    fileType: Joi.string().optional(),
    fileExtension: Joi.string().optional(),
    uploadedAt: Joi.date().optional(),
  }).optional(),
});

const updateSellerProfileSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  businessName: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  avatar: Joi.object({
    fileUrl: Joi.string().uri().required(),
    fileName: Joi.string().optional(),
    fileType: Joi.string().optional(),
    fileExtension: Joi.string().optional(),
    uploadedAt: Joi.date().optional(),
  }).optional(),
  businessRegistrationDate: Joi.date().optional(),
  businessType: Joi.string()
    .valid("wholeseller", "retailer", "manufacturer", "designer", "service")
    .optional(),
  address: addressSchema.optional(),
  documents: Joi.array().items(documentSchema).optional(),
  accountHolderName: Joi.string().optional(),
  bankName: Joi.string().optional(),
  bankAccountNumber: Joi.string().optional(),
  ifscCode: Joi.string().alphanum().optional(),
});

module.exports = { updateSellerProfileSchema };

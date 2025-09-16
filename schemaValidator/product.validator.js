const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().trim().required(), // Fabric, Garment, Yarn, Accessory
  subCategory: Joi.string().trim().optional(),

  description: Joi.object({
    short: Joi.string().allow(""),
    long: Joi.string().allow(""),
  }).optional(),

  brand: Joi.string().trim().optional(),
  countryOfOrigin: Joi.string().trim().optional(),

  preview: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        type: Joi.string().valid("image", "video").required(),
      })
    )
    .optional(),

  thumbnail: Joi.object({
    url: Joi.string().uri().required(),
    type: Joi.string().valid("image").required(),
  }).optional(),

  unit: Joi.string().valid("pcs", "m", "kg").required(),

  price: Joi.object({
    value: Joi.number().required(),
    currency: Joi.string().default("INR"),
    minPrice: Joi.number().optional(),
    maxPrice: Joi.number().optional(),
  }).required(),

  moq: Joi.number().default(1),
  sampleAvailable: Joi.boolean().default(false),
  sampleCost: Joi.number().optional(),

  availability: Joi.object({
    inStock: Joi.boolean().default(true),
    quantity: Joi.number().default(0),
  }).optional(),
});

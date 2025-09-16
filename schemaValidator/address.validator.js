const Joi = require("joi");

exports.addressSchema = Joi.object({
  isPrimary: Joi.boolean().default(false),
  address: Joi.string().trim().optional(),
  locality: Joi.string().trim().optional(),
  landmark: Joi.string().trim().optional(),
  geolocation: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
      .items(Joi.number().required()) // longitude, latitude
      .length(2)
      .required(),
  }).optional(),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(), // 6 digit pincode
  state: Joi.string().required(),
  country: Joi.string().required(),
  formattedAddress: Joi.string().required(),
  name: Joi.string().optional(),
  phoneNumber: Joi.string().optional(), // 10 digit phone
});

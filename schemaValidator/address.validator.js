const Joi = require("joi");

exports.addressSchema = Joi.object({
  isPrimary: Joi.boolean().default(false),
  address: Joi.string().trim().required(),
  locality: Joi.string().trim().required(),
  landmark: Joi.string().trim().allow(null, ""),
  geolocation: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array()
      .items(Joi.number().required()) // longitude, latitude
      .length(2)
      .required(),
  }).required(),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(), // 6 digit pincode
  state: Joi.string().required(),
  country: Joi.string().required(),
  formattedAddress: Joi.string().required(),
  name: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+91)?[0-9]\d{9}$/)
    .required(), // 10 digit phone
});

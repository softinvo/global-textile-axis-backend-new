const Joi = require("joi");

const updateBuyerProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  avatar: Joi.object({
    fileUrl: Joi.string().uri().required(),
    fileName: Joi.string().optional(),
    fileType: Joi.string().optional(),
    fileExtension: Joi.string().optional(),
    uploadedAt: Joi.date().optional(),
  }).optional(),
});

module.exports = { updateBuyerProfileSchema };

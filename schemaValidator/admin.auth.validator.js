const Joi = require("joi");

exports.signUpAdminSV = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

exports.signInAdminSV = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

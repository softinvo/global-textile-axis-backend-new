const Joi = require("joi");

exports.sendOtpSV = Joi.object({
  otpType: Joi.string()
    .valid("login", "forgotPassword", "verify")
    .required()
    .messages({
      "any.required": "OTP type is required",
      "any.only": "OTP type must be one of login, forgotPassword, verify",
    }),

  phone: Joi.string()
    .pattern(/^(\+91)?[0-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be valid (10 digits or with +91 prefix)",
      "any.required": "Phone number is required",
    }),

  userType: Joi.string().valid("buyer", "seller").required().messages({
    "any.required": "User type is required",
    "any.only": "User type must be either buyer or seller",
  }),
});

// Validation schema for OTP verification
exports.loginWithPhoneSV = Joi.object({
  phone: Joi.string()
    .pattern(/^(\+91)?[0-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be valid (10 digits or with +91 prefix)",
      "any.required": "Phone number is required",
    }),

  otp: Joi.string()
    .length(6) // OTP must be exactly 6 digits
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),

  userType: Joi.string().valid("buyer", "seller").required().messages({
    "any.only": "userType must be either buyer or seller",
    "any.required": "userType is required",
  }),
});

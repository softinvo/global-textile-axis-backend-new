const OTP = require("../models/otp.model");
const Seller = require("../models/seller.model");
const Buyer = require("../models/buyer.model");
const Joi = require("joi");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const axios = require("axios");
// const { generateOTP } = require("../helpers/generateOTP");
// const { sendOtpViaSMS, sendOtpViaEmail } = require("../helpers/sendotp");
// const checkAvailability = require("../helpers/unique_phone_email");
const {
  sendOtpSV,
  loginWithPhoneSV,
} = require("../schemaValidator/authValidator");

// ################# Send Otp ##########################
const sendOtpUser = async (req, res) => {
  try {
    const validateReqBody = await sendOtpSV.validateAsync(req.body);
    const { otpType, phone, userType } = validateReqBody;
    // const otp = generateOTP();
    const otp = "123456"; // For testing purposes, using a static OTP
    if (userType === "buyer") {
      const otpPayload = {
        otpType,
        phone,
        otp,
        userType,
      };
      if (otpType === "forgotPassword") {
        const user = await Buyer.findOne({ phone: phone });
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "User Not Found",
          });
        }
      }
      const phoneEntry = await OTP.create(otpPayload);
      // const response = await sendOtpViaSMS(phone, otp);
      // return res.status(response.success ? 200 : 500).json(response);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } else {
      const otpPayload = {
        otpType,
        phone,
        otp,
        userType,
      };
      const phoneEntry = await OTP.create(otpPayload);
      // const response = await sendOtpViaSMS(phone, otp);
      // return res.status(response.success ? 200 : 500).json(response);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).json({
        success: false,
        messages: err.details[0].message,
      });
    }
    return res.status(500).json({
      success: false,
      messages: "Internal Server Error",
    });
  }
};

// ####################### Login With Phone #############################
const loginWithPhone = async (req, res) => {
  try {
    const validateReqBody = await loginWithPhoneSV.validateAsync(req.body);
    const { phone, otp, userType } = validateReqBody;
    const recentOTP = await OTP.findOne({
      phone,
      otp,
      otpType: "login",
      userType,
    }).sort({ createdAt: -1 });

    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (userType === "buyer") {
      // Find or create the buyer
      let buyer = await Buyer.findOne({ phone });

      if (!buyer) {
        buyer = await Buyer.create({
          phone,
        });
      }

      const token = buyer.generateToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      const expired_at = new Date();
      expired_at.setDate(expired_at.getDate() + 30);
      await Token.create({
        objectDocId: buyer._id,
        userType,
        token: token,
        expired_at,
      });

      const buyerDetails = await Buyer.aggregate([
        { $match: { _id: buyer._id } },
        {
          $project: {
            email: { $ifNull: ["$email", ""] },
            phone: { $ifNull: ["$phone", ""] },
            name: { $ifNull: ["$name", ""] },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userType,
        data: buyerDetails[0],
      });
    } else {
      // Find or create the seller
      let seller = await Seller.findOne({ phone });
      if (!seller) {
        seller = await Seller.create({
          phone,
        });
      }

      const token = seller.generateToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      const expired_at = new Date();
      expired_at.setDate(expired_at.getDate() + 30);
      await Token.create({
        objectDocId: seller._id,
        userType,
        token: token,
        expired_at,
      });

      const sellerDetails = await Seller.aggregate([
        { $match: { _id: seller._id } },
        {
          $project: {
            email: { $ifNull: ["$email", ""] },
            phone: { $ifNull: ["$phone", ""] },
            name: { $ifNull: ["$name", ""] },
            profileStatus: { $ifNull: ["$profileStatus", ""] },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userType,
        data: sellerDetails[0],
      });
    }
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).json({
        success: false,
        messages: err.details[0].message,
      });
    }
    return res.status(500).json({
      success: false,
      messages: "Internal Server Error",
    });
  }
};

// ####################### Logout ########################################
const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Remove the token from the database
    await Token.findOneAndDelete({
      token,
      objectDocId: partnerId,
      userType: "Partner",
    });

    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  sendOtpUser,
  loginWithPhone,
};

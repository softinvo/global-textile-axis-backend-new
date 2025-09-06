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
  signUpUserSV,
  loginWithEmailSV,
  changePasswordSV,
  forgetPasswordSV,
  resetPasswordSV,
  resetPasswordViaSmsSV,
  changePhoneOrEmailSV,
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

// ####################### SignUp User ###################################
const signUpUser = async (req, res) => {
  try {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const validateReqBody = await signUpUserSV.validateAsync(req.body);
    const { email, phone, password, chatSocketId } = validateReqBody;

    const isPhoneAvailable = await checkAvailability("phone", phone, "Partner");

    if (!isPhoneAvailable) {
      return res.status(400).json({
        success: false,
        message: `Phone number is already registered for User.`,
      });
    }

    // Check if email is available
    const isEmailAvailable = await checkAvailability("email", email, "Partner");

    if (!isEmailAvailable) {
      return res.status(400).json({
        success: false,
        message: `Email is already registered for User.`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new partner
    const newPartner = await Partner.create({
      email,
      password: hashedPassword,
      username: email.split("@")[0],
      phone: phone,
      name: "Guest Partner",
      chatSocketId,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).json({
        success: false,
        message: err.details[0].message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Login With Email ##############################
const loginWithEmail = async (req, res) => {
  try {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const validateReqBody = await loginWithEmailSV.validateAsync(req.body);
    const { email, password, deviceType } = validateReqBody;

    // Find the partner by email
    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid email.",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password.",
      });
    }

    // Generate a token for the user
    const token = partner.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: true,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 30);
    await Token.create({
      objectDocId: partner._id,
      userType: "Partner",
      token: token,
      deviceType: deviceType,
      expired_at,
    });
    const partnerDetails = await Partner.aggregate([
      { $match: { _id: partner._id } },
      {
        $project: {
          email: { $ifNull: ["$email", ""] },
          phone: { $ifNull: ["$phone", ""] },
          name: { $ifNull: ["$name", ""] },
          avatar: { $ifNull: ["$avatar", ""] },
          gender: { $ifNull: ["$gender", ""] },
          businessName: { $ifNull: ["$businessName", ""] },
          address: { $ifNull: ["$address", ""] },
          city: { $ifNull: ["$city", ""] },
          pincode: { $ifNull: ["$pincode", ""] },
          state: { $ifNull: ["$state", ""] },
          country: { $ifNull: ["$country", ""] },
          chatSocketId: { $ifNull: ["$chatSocketId", ""] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      partnerDocId: partner._id,
      token: token,
      partnerDetails: partnerDetails[0],
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      return res.status(400).json({
        success: false,
        message: err.details[0].message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Change Password ###############################
const changePassword = async (req, res) => {
  try {
    // Validate request body
    const validateReqBody = await changePasswordSV.validateAsync(req.body);
    const { currentPassword, newPassword } = validateReqBody;
    const partnerId = req.partnerId;
    // Find the partner by Id
    const partner = await Partner.findById({ partnerId });
    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Partner not found.",
      });
    }

    // Check if current password is correct
    const isMatch = bcrypt.compare(currentPassword, partner.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    partner.password = hashedNewPassword;
    await partner.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.isJoi) {
      // Handle validation error
      return res.status(400).json({
        success: false,
        message: err.details[0].message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Reset Password Via Email ###############################
const linkSentOnEmailForChangePassword = async (req, res) => {
  try {
    // Validate request body
    const validateReqBody = await forgetPasswordSV.validateAsync(req.body);
    const { email } = validateReqBody;

    // Find the partner by email
    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Partner not found.",
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    partner.resetToken = resetToken;
    partner.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await partner.save();

    // Send reset email
    const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ############### Reset Password Using Token send on Email #########################
const resetPassword = async (req, res) => {
  try {
    // Validate request body
    const validateReqBody = await resetPasswordSV.validateAsync(req.body);
    const { token, newPassword, confirmNewPassword } = validateReqBody;

    // Find the partner by reset token
    const partner = await Partner.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    // Hash the new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    partner.password = hashedNewPassword;
    partner.resetToken = ""; // Clear reset token
    partner.resetTokenExpiry = ""; // Clear token expiry
    await partner.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ####################### Verify OTP for Reset Via SMS #################################
const verifyOTPViaSMSForReset = async (req, res) => {
  try {
    const validateReqBody = await resetPasswordViaSmsSV.validateAsync(req.body);
    const { phone, otp } = validateReqBody;
    const user = await Partner.findOne({
      phone: phone,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
    const recentOTP = await OTP.findOne({
      phone,
      otp,
      otpType: "forChangePassword",
      // appType: "Partner",
    }).sort({ createdAt: -1 });

    if (!recentOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Reset Via SMS #################################
const resetPasswordViaSMS = async (req, res) => {
  try {
    const validateReqBody = await resetPasswordViaSmsSV.validateAsync(req.body);
    const { phone, newPassword } = validateReqBody;
    const partner = await Partner.findOne({
      phone: phone,
    });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    partner.password = hashedNewPassword;
    await partner.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Change OR Add Email or Phone ##########################
const changePhoneOrEmail = async (req, res) => {
  const partnerId = req.partnerId;
  const validateReqBody = await changePhoneOrEmailSV.validateAsync(req.body);
  const { newEmail, newPhone } = validateReqBody;

  try {
    // Check if the new email is already in use
    if (newEmail) {
      const emailExists = await Partner.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "This email is already in use.",
        });
      }
    }

    // Check if the new phone number is already in use
    if (newPhone) {
      const phoneExists = await Partner.findOne({ phone: newPhone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "This phone number is already in use.",
        });
      }
    }

    // Update the user's email and/or phone
    const updatedUser = await Partner.findByIdAndUpdate(
      partnerId,
      {
        ...(newEmail && { email: newEmail }),
        ...(newPhone && { phone: newPhone }),
      },
      { new: true } // Return the updated user
    );

    return res.status(200).json({
      success: true,
      message: "Contact information updated successfully.",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ####################### Logout ########################################
const logout = async (req, res) => {
  try {
    const partnerId = req.partnerId;
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
  signUpUser,
};

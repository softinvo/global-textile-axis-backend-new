const Admin = require("../../models/admin.model");
const Token = require("../../models/token.model");
const bcrypt = require("bcrypt");
const {
  signUpAdminSV,
  signInAdminSV,
} = require("../../schemaValidator/admin.auth.validator");

// ##########################  Admin Sign-up Controller  ################################
const adminSignup = async (req, res) => {
  try {
    const validateReqBody = await signUpAdminSV.validateAsync(req.body);
    const { email, password, role } = validateReqBody;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email: email,
      password: hashedPassword,
      type: "admin",
      role: role,
    });

    await newAdmin.save();

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ############################  Admin Login Controller  #################################
const adminLogin = async (req, res) => {
  try {
    const validateReqBody = await signInAdminSV.validateAsync(req.body);
    const { email, password } = validateReqBody;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token using utility
    const token = admin.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: true,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 30);
    await Token.create({
      objectDocId: admin._id,
      userType: "admin",
      token: token,
      expired_at,
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        type: admin.type,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
};

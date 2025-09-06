const jwt = require("jsonwebtoken");
const Buyer = require("../models/buyer.model");
const Seller = require("../models/seller.model");
// const Admin = require("../models/adminModel");
const Token = require("../models/token.model");

exports.isBuyerAuth = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    // const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token
    const user = await Buyer.findById(decoded._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Find the token in the database
    const tokenDoc = await Token.findOne({
      token: token,
      objectDocId: decoded._id,
      userType: "Buyer",
    });

    if (!tokenDoc) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Check if the token is expired
    const now = new Date();
    if (now > new Date(tokenDoc.expired_at)) {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }

    // Attach user
    req.userId = user._id;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.isSellerAuth = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    // const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the seller based on the decoded token
    const seller = await Seller.findById(decoded._id);
    if (!seller) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Find the token in the database
    const tokenDoc = await Token.findOne({
      token: token,
      objectDocId: decoded._id,
      userType: "Seller",
    });

    if (!tokenDoc) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Check if the token is expired
    const now = new Date();
    if (now > new Date(tokenDoc.expired_at)) {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }

    // Attach partner
    req.partnerId = partner._id;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// exports.isAdminAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No token provided" });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

//     // Find the partner based on the decoded token
//     const admin = await Admin.findById(decoded._id);
//     if (!admin) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Admin Not Found" });
//     }

//     // Find the token in the database
//     const tokenDoc = await Token.findOne({
//       token: token,
//       objectDocId: decoded._id,
//       userType: "Admin",
//     });

//     if (!tokenDoc) {
//       return res.status(401).json({ success: false, message: "Invalid token" });
//     }

//     // Check if the token is expired
//     const now = new Date();
//     if (now > new Date(tokenDoc.expired_at)) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Token has expired" });
//     }

//     // Attach partner
//     req.adminId = admin._id;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };

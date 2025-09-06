const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });

// ################## Send OTP via SMS ######################
async function sendOtpViaSMS(phone, otp) {
  const newphone = phone.replace("+", "");
  const url = process.env.URL;
  const params = {
    dr: false,
    sender: "FRICOZ",
    recipient: newphone,
    msg: `Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.`,
    user: process.env.USER,
    pswd: process.env.PASS,
    PE_ID: process.env.PE_ID,
    Template_ID: process.env.TEMP_ID,
  };

  try {
    await axios.get(url, { params: params });
    return { success: true, message: "OTP sent to phone." };
    // return { success: true, otp: otp, message: "OTP sent to phone." };
  } catch (error) {
    console.error("Error sending OTP via SMS:", error);
    return { success: false, message: "Failed to send OTP via SMS." };
  }
}

// ###################### Send OTP Via Email ###########################
async function sendOtpViaEmail(email, otp) {
  return { success: true, message: "OTP sent to email." };
}

module.exports = { sendOtpViaSMS, sendOtpViaEmail };

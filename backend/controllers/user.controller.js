import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import userModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/VerifyEmailTemplate.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUDE_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

// This is user Register Controller
export async function registerUserController(req, res) {
  try {
    let user;
    // Get auth details from frontend
    const { name, email, password } = req.body;

    // check if any field empty or not
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please Provide Your Name, Email and Password.",
        error: true,
        success: false,
      });
    }

    // Check on database that there user alredy have or not
    user = await userModel.findOne({ email });

    // if user fill up all field then check that it already have in database then throw an error
    if (user) {
      return res.json({
        message: "User Already Registerd With This Email.",
        error: true,
        success: false,
      });
    }

    // Generate VerifyCode / OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // if user not found in database then hashed password and create as new user
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    user = new userModel({
      name: name,
      email: email,
      password: hashPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 300000,
    });

    await user.save();

    // Send Verification Email
    await sendEmail({
      sendTo: email,
      subject: "Verify Your Email",
      text: "",
      html: verifyEmailTemplate(name, verifyCode),
    });

    // Create a JWT token for verification purpouse
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      error: false,
      email: user.email,
      message: "User Registerd Successfully! Please Verify Your Email",
      token: token, // Optional: include this if needed for verification
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to Register a user",
      error: true,
      success: false,
    });
  }
}

// This is user Email Verify Controller
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;

    // Found the user is he/she have in databse or not if not then user not found error throw
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found.",
        error: true,
        success: false,
      });
    }

    // check otp in user otp and user gmail send otp which i get req.body
    const isOtpValid = user.otp === otp;

    // check isOtpExpired or not if current date is greater than user.otpExpired time then otp expired true
    const isNotExpired = user.otpExpires > Date.now();

    // Check is otpValid && isNotExpired then Email verified Successfull
    if (isOtpValid && isNotExpired) {
      (user.verify_email = true),
        (user.otp = null),
        (user.otpExpires = null),
        await user.save();
      return res.status(200).json({
        message: "Email Verified Successfull",
        error: false,
        success: true,
      });
    } else if (!isOtpValid) {
      // if user.otp & user input otp is not equal then throw this error
      return res.status(400).json({
        message: "Invalid OTP, Please Enter a Valid OTP",
        error: true,
        success: false,
      });
    } else {
      // if isNotExpired means otpExpires time is greater then current time then otp isNotExpired === false but if isNotExpired  = otpExpires time is less then current time or current time is bigger then otpExpires time then throw this error
      return res.status(400).json({
        message: "OTP Expired",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Email Varification Failed.",
      error: true,
      success: false,
    });
  }
}

export async function sendAgainOtp(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    // Generate VerifyCode / OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send Verification Email
    await sendEmail({
      sendTo: email,
      subject: "Verify Your Email",
      text: "",
      html: verifyEmailTemplate(user.name, verifyCode),
    });

    user.otp = verifyCode;
    await user.save();

    res.status(200).json({
      success: true,
      error: false,
      message: "Successfull to Send OTP.",
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error to Send OTP!",
    });
  }
}

// This is user Login Controller
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    // Found The user is he/she have on database or not
    const user = await userModel.findOne({ email });

    // If user not Found then throw this error User not Found
    if (!user) {
      return res.status(404).json({
        message: "User not Found with This Email",
        success: false,
        error: true,
      });
    }

    // If user email is not verified then he/she cannot login
    if (user.verify_email !== true) {
      return res.status(400).json({
        message:
          "Your Email is not verify yet. Please verify it and then try to login.",
        error: true,
        success: false,
      });
    }

    // Match or Check password to verify user
    const isPassMatch = await bcryptjs.compare(password, user.password);

    // isn't match user enterd password to registered from database password then throw this error your password is wrong, please try again.
    if (!isPassMatch) {
      return res.status(400).json({
        message: "Your Password is Wrong, Please try again!",
        success: false,
        error: true,
      });
    }

    // After Login a user update his/her last login date
    await userModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    // This is the cookie options
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET_KEY
    );

    // accessToken and refreshToken set as a cookie
    res.cookie("token", token, cookiesOption);

    // and Finally if all done then verified message will be Login Successfull
    return res.status(200).json({
      message: "Login Successfull",
      error: false,
      success: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to Login",
      error: true,
      success: false,
    });
  }
}

export const userLogout = async (_, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(201).json({ success: true, message: "Log Out Successfull." });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error to LogOut!",
    });
  }
};

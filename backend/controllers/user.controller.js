import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/sendEmail.js";
import userModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/VerifyEmailTemplate.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUDE_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

// ============ User Register ================== //
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

    user = new userModel({
      name: name,
      email: email,
      password,
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

    const token = await userModel.generateToken(user._id, res);

    return res.status(200).json({
      success: true,
      error: false,
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

// ============ Verify Email ================== //
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

// ============ Send Again Otp ================== //
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

// ============ User Login ================== //
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
    const isMatchedPassword = await user.comparePassword(password);

    // isn't match user enterd password to registered from database password then throw this error your password is wrong, please try again.
    if (!isMatchedPassword || !email) {
      return res.status(400).json({
        message: "Please Enter Yout Valid Email & Password!",
        success: false,
        error: true,
      });
    }

    const token = await userModel.generateToken(user._id, res);

    // After Login a user update his/her last login date
    await userModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    // and Finally if all done then verified message will be Login Successfull
    return res.status(200).json({
      message: "Login Successfull",
      error: false,
      success: true,
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to Login",
      error: true,
      success: false,
    });
  }
}

// ============ User Logout ================== //
export async function logoutController(_, res) {
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
}

// This is User avatar Upload Controller
// export async function userAvatarUploadController(req, res) {
//   try {
//     const userId = req.user.id;
//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User Not Found! Please Login First.",
//         error: true,
//         success: false,
//       });
//     }

//     // Delete old image from Cloudinary (if exists)
//     if (user.avatar) {
//       const imageUrl = user.avatar;
//       const urlArr = imageUrl.split("/");
//       const image = urlArr[urlArr.length - 1];
//       const imageName = image.split(".")[0];
//       await cloudinary.uploader.destroy(imageName);
//     }

//     // Cloudinary upload options
//     const options = {
//       use_filename: true,
//       unique_filename: true,
//       overwrite: true,
//     };

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, options);

//     // Delete local file after upload
//     fs.unlinkSync(req.file.path);

//     // Save new avatar URL in database
//     user.avatar = result.secure_url;
//     await user.save();

//     return res.status(200).json({
//       message: "Successfully Image Upload",
//       _id: userId,
//       avatar: result.secure_url,
//       success: true,
//     });
//   } catch (error) {
//     console.error("❌ Upload Error:", error);
//     return res.status(500).json({
//       message: error.message || "Failed to Upload Image",
//       error: true,
//       success: false,
//     });
//   }
// }

// This is User avatar Remove Controller
// export async function userAvatarRemoveController(req, res) {
//   try {
//     // Get Image url From user query parameter
//     const imageUrl = req.query.img;

//     // Make an Array of this image url by split("/")
//     const urlArr = imageUrl.split("/");

//     // Take the Last element of the Array
//     const image = urlArr[urlArr.length - 1];

//     // And Finally get a name of image without extention like (.jpg, .png, .jpeg)
//     const imageName = image.split(".")[0];

//     // In Cloudinary Remove image
//     if (imageName) {
//       await cloudinary.uploader.destroy(imageName);
//     }

//     // Delete Image from Databse
//     await userModel.findByIdAndUpdate(req.user.id, {
//       avatar: "",
//     });

//     // And Finally Trow the Success Message
//     return res.status(200).json({
//       message: "Image Successfylly Deleted",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Failed to Delete Image",
//       success: false,
//       error: true,
//     });
//   }
// }

// This is user Details Update Controller
// export async function userDetailsUpdateControlers(req, res) {
//   try {
//     // Get authenticated user id
//     const userId = req.user.id;

//     // Get user updated input from frontend body
//     const { name, email, password, mobile } = req.body;

//     // user is exist or not find it by id
//     const existUser = await userModel.findById(userId);

//     // If user not exist then trow this error message
//     if (!existUser) {
//       return res.status(404).json({
//         message: "User Not Found. Please Login First.",
//         success: false,
//         error: true,
//       });
//     }

//     // if User found then and change email and chnage email not same as before then send otp
//     let verifyOtp = "";

//     // Generate random 6 digit otp
//     if (email !== existUser.email) {
//       verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     }

//     let hashePassword = "";

//     // Hashed Password by using bcrypt
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       hashePassword = await bcrypt.hash(password, salt);
//     } else {
//       hashePassword = existUser.password;
//     }

//     // Update user
//     await userModel.findByIdAndUpdate(
//       userId,
//       {
//         name,
//         mobile,
//         email,
//         verify_email: email !== existUser.email ? true : false,
//         password: hashePassword,
//         otp: verifyOtp !== "" ? verifyOtp : null,
//         otpExpires: verifyOtp !== "" ? Date.now() + 300000 : "",
//       },
//       { new: true }
//     );

//     // If user change email not matched in registered email then send email confirmation again
//     if (email !== existUser.email) {
//       await sendEmail({
//         sendTo: email,
//         subject: "Verify Yout OTP",
//         text: "",
//         html: verifyEmailTemplate(name, verifyOtp),
//       });
//     }

//     //
//     return res.status(200).json({
//       message: "Successfully update user and verify otp sent to your email.",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Failed to Update user.",
//       error: true,
//       success: false,
//     });
//   }
// }

// This is User forgot password Controller
// export async function userForgotPasswordController(req, res) {
//   try {
//     // Get Email From Frontend
//     const { email } = req.body;

//     // Check with this email in database user have or not
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "User Not Found With This Email, Please Register First.",
//         error: true,
//         success: false,
//       });
//     }

//     // generate OTP
//     const verifyOTP = generateOTP();
//     user.otp = verifyOTP;
//     user.otpExpires = Date.now() + 300000;

//     // Send Email
//     await sendEmail({
//       sendTo: email,
//       subject: `Reset your password — your OTP is ${verifyOTP}`,
//       text: "",
//       html: verifyForgotPasswordEmailTemplate(
//         user.name,
//         user.otpExpires,
//         verifyOTP,
//         process.env.SUPPORT_EMAIL,
//         process.env.COMPANY_NAME
//       ),
//     });

//     // Save it on databse
//     await user.save();

//     return res.status(200).json({
//       message: "We have Sent a Email, Please Check Your Email",
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message:
//         error.message || "Failed to Forgot Password, Please contact our Team.",
//       error: true,
//       success: false,
//     });
//   }
// }

//  This is user Forgot Password OTP Verify Controller
// export async function verifyForgotPasswordOTPController(req, res) {
//   try {
//     // get email and otp from input field
//     const { email, otp } = req.body;

//     // Check email and otp
//     if (!email || !otp) {
//       return res.status(400).json({
//         message: "Provide Required field as email & otp",
//         error: true,
//         success: false,
//       });
//     }

//     // Check with this email users found or not
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         message: "Email is not Available",
//         error: true,
//         succes: false,
//       });
//     }

//     // otp Expires
//     const currentDate = new Date().toISOString();
//     if (user.otpExpires < currentDate) {
//       return res.status(400).json({
//         message: "OTP is Expired",
//         succes: false,
//         error: true,
//       });
//     }

//     // Check otp is valid or not
//     if (otp !== user.otp) {
//       return res.status(400).json({
//         message: "Invalid OTP.",
//         success: false,
//         error: true,
//       });
//     }

//     (user.otp = ""), (user.otpExpires = "");
//     await user.save();

//     // Finally verified otp
//     return res.status(200).json({
//       message: "OTP Verified Successfull.",
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Failed to verify yout OTP.",
//     });
//   }
// }

//  This is user Reset Password Controller
// export async function resetPasswordController(req, res) {
//   try {
//     const { email, oldPassword, newPassword, confirmPassword } = req.body;
//     console.log(email);
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         message: "Please Provide Required Field.",
//         error: true,
//         success: false,
//       });
//     }

//     const user = await userModel.findOne({ email });
//     console.log(user);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found with this email.",
//         success: false,
//         error: true,
//       });
//     }

//     const isPassMatch = await bcrypt.compare(oldPassword, user.password);

//     if (!isPassMatch) {
//       return res.status(400).json({
//         message: "Old Password is incorrect.",
//         success: false,
//       });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         message: "New Password and Confirm Password do not Match!",
//         succes: false,
//         error: true,
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(newPassword, salt);

//     await userModel.findOneAndUpdate(
//       { _id: user._id },
//       { password: hashPassword }
//     );

//     return res.status(200).json({
//       message: "Password changed successfully.",
//       success: true,
//       error: false,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message || "Failed to Change Password.",
//       success: false,
//       error: true,
//     });
//   }
// }

// This is user refresToken Controller
// export async function refreshTokenController(req, res) {
//   try {
//     const refreshToken =
//       req.cookies.refreshToken || res?.headers?.authorization.split(" ")[1]; // Bearer token

//     if (!refreshToken) {
//       return res.status(400).json({
//         mwssage: "Invalid Resfresh Token.",
//         error: true,
//         success: false,
//       });
//     }

//     const verifyToken = jwt.verify(
//       refreshToken,
//       process.env.JWT_SECRET_KEY_REFRESH_TOKEN
//     );

//     if (!verifyToken) {
//       return res.status(401).json({
//         mwssage: "Token is expired.",
//         error: true,
//         success: false,
//       });
//     }

//     const userId = verifyToken?._id;
//     const newAccessToken = await generateAccessToken(userId);
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//     };

//     res.cookie("accessToken", newAccessToken, cookieOptions);

//     return res.status(200).json({
//       message: "New Access Token Generated.",
//       error: false,
//       success: true,
//       data: {
//         accessToken: newAccessToken,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.error || "Refresh Token in valid.",
//       error: true,
//       success: false,
//     });
//   }
// }

// This is user details controller to get user details
// export async function userDetails(req, res) {
//   try {
//     const userid = req.user.id;

//     const user = await userModel
//       .findById(userid)
//       .select("-password -refresh_token");

//     return res.status(200).json({
//       message: "User Details",
//       success: true,
//       error: false,
//       data: user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Something is wrong.",
//       success: false,
//       error: true,
//     });
//   }
// }

// Update User Details
// export const userDetailsUpdate = async (req, res) => {
//   try {
//     const { name, email, mobile, dob } = req.body;
//     const userid = req.user.id;

//     const updateUser = await userModel.findByIdAndUpdate(
//       { _id: userid },
//       {
//         name,
//         email,
//         mobile,
//         dob,
//       }
//     );
//     console.log(updateUser);
//     res.status(200).json({
//       success: true,
//       error: false,
//       updateUser,
//       message: "Successfull to Update User Details.",
//     });
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: error.message || "Internal Server Error to Update User Details!",
//     });
//   }
// };

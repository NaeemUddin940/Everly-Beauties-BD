import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import env from "../lib/env.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Enter Your Email."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Enter Password."],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "In-Active", "Suspended"],
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "order",
      },
    ],
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if password not changed then dont use this function
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ======== User Generate Token Method ======= //
userSchema.statics.generateToken = async function (userId, res) {
  if (res.headersSent) return;
  const token = jwt.sign({ userId }, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRESIN,
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days as a Mili Second (MS)
    httpOnly: true, // prevents XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF Attacks
    secure: env.NODE_ENV === "production" ? true : false,
  });

  return token;
};

// Method to compare password during login
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const userModel = mongoose.model("user", userSchema);
export default userModel;

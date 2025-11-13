import mongoose from "mongoose";

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
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;

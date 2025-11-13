import jwt from "jsonwebtoken";
import env from "../lib/env.js";
import userModel from "../models/user.model.js";

export async function authenticated(req, res, next) {
  try {
    const token =
      req.cookies.token || req?.header?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access Token Not Found! Please Login First.",
        success: false,
        error: true,
      });
    }

    const decode = jwt.verify(token, env.JWT_SECRET_KEY);

    if (!decode)
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized - Invalid token!" });

    const user = await userModel.findById(decode.id).select("-password");
    if (!user) return res.status(400).json({ message: "User not Found!" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in Protecting Route / Authenticated!");
    return res.status(500).json({
      success: true,
      message: "Internal Server Error",
    });
  }
}

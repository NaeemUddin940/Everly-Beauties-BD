import { Router } from "express";
import {
  loginUserController,
  logoutController,
  registerUserController,
  sendAgainOtp,
  verifyEmailController,
} from "../controllers/user.controller.js";
import { authenticated } from "../middlewares/authMiddlewares.js";

const userRoute = Router();

userRoute.post("/register", registerUserController);
userRoute.post("/verify-email", verifyEmailController);
userRoute.post("/send-otp-again", sendAgainOtp);
userRoute.post("/login", authenticated, loginUserController);
userRoute.get("/logout", authenticated, logoutController);
userRoute.get("/check-login", authenticated, (req, res) =>
  res.status(200).json(req.user)
);

export default userRoute;

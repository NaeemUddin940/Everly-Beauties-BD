import { Router } from "express";
import {
  loginUserController,
  registerUserController,
  sendAgainOtp,
  userLogout,
  verifyEmailController,
} from "../controllers/user.controller.js";
import { authenticated } from "../middlewares/authMiddlewares.js";

const userRoute = Router();

userRoute.post("/register", registerUserController);
userRoute.post("/verify-email", verifyEmailController);
userRoute.post("/send-otp-again", sendAgainOtp);
userRoute.post("/login", loginUserController);
userRoute.get("/logout", authenticated, userLogout);
userRoute.get("/check-login", authenticated, (req, res) =>
  res.status(200).json(req.user)
);

export default userRoute;

import express from "express";

import { register, verifyOTP, login } from "../controllers/authController.js";


import {
  registerValidator,
  verifyOTPValidator,
  loginValidator,
} from "../validators/authValidator.js";


const router = express.Router();

router.post("/register", registerValidator, register);

router.post("/verify-otp", verifyOTPValidator, verifyOTP);

router.post("/login", loginValidator, login);

export default router;

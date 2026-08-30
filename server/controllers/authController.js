import { validationResult } from "express-validator";

import User from "../models/User.js";
import OTP from "../models/OTP.js";

import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";


// REGISTER


export const register = async (req, res, next) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // ==========================================
    // CREATE USER
    // Password automatically hashed
    // by User model pre-save middleware
    // ==========================================

    const user = await User.create({
      name,
      email,
      password,
      role: "candidate",
    });

    // ==========================================
    // GENERATE OTP
    // ==========================================

    const otpCode = generateOTP();

    // ==========================================
    // REMOVE OLD OTP
    // ==========================================

    await OTP.deleteMany({ email });

    // ==========================================
    // SAVE OTP
    // ==========================================

    await OTP.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // ==========================================
    // SEND OTP EMAIL
    // ==========================================

    await sendEmail({
      to: email,
      subject: "JobTrack - Email Verification OTP",
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >

          <h2>Welcome to JobTrack 👋</h2>

          <p>
            Thank you for registering with JobTrack.
          </p>

          <p>
            Your email verification OTP is:
          </p>

          <h1
            style="
              letter-spacing: 8px;
              text-align: center;
            "
          >
            ${otpCode}
          </h1>

          <p>
            This OTP is valid for
            <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not create this account,
            please ignore this email.
          </p>

          <br />

          <p>
            Regards,<br />
            <strong>JobTrack Team</strong>
          </p>

        </div>
      `,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};


// VERIFY OTP


export const verifyOTP = async (req, res, next) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, otp } = req.body;

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // CHECK ALREADY VERIFIED
    // ==========================================

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // ==========================================
    // FIND OTP
    // ==========================================

    const otpRecord = await OTP.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ==========================================
    // VERIFY USER
    // ==========================================

    user.isVerified = true;

    await user.save();

    // ==========================================
    // DELETE OTP
    // ==========================================

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


// LOGIN


export const login = async (req, res, next) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // ==========================================
    // FIND USER
    // Include password because User schema
    // has select: false
    // ==========================================

    const user = await User.findOne({ email }).select("+password");

    // ==========================================
    // DEBUG CHECK
    // ==========================================

    console.log("========== LOGIN DEBUG ==========");
    console.log("USER FOUND:", !!user);
    console.log("EMAIL:", user?.email);
    console.log("PASSWORD FIELD EXISTS:", !!user?.password);
    console.log("VERIFIED:", user?.isVerified);
    console.log("=================================");

    // ==========================================
    // USER NOT FOUND
    // ==========================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // CHECK EMAIL VERIFICATION
    // ==========================================

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
      });
    }

    // ==========================================
    // CHECK PASSWORD EXISTS
    // ==========================================

    if (!user.password) {
      console.error("ERROR: User password is missing from database");

      return res.status(500).json({
        success: false,
        message: "User password is missing. Please register again.",
      });
    }

    // ==========================================
    // COMPARE PASSWORD
    // ==========================================

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // ==========================================
    // INVALID PASSWORD
    // ==========================================

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // GENERATE JWT
    // ==========================================

    const token = generateToken(user._id);

    // ==========================================
    // SET HTTP-ONLY COOKIE
    // ==========================================

    res.cookie("accessToken", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      maxAge: 24 * 60 * 60 * 1000,
    });

    // ==========================================
    // UPDATE LAST LOGIN
    // ==========================================

    user.lastLogin = new Date();

    await user.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    next(error);
  }
};



// LOGOUT

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};
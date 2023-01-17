const catchAsyncErrors = require("../middleware/catchAsyncError");
import express from "express";
import { sendToken } from "../utils/sendToken";
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
import ErrorHandler from "../utils/errorHandler";
const crypto = require("crypto");

/* Register user */
export const registerUser = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { name, email, password, avatar } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "avatar",
        url: "https://res.cloudinary.com/dxqjyqz8p/image/upload/v1620000000/avatar/avatar.png",
      },
    });

    sendToken(res, 200, user);
  }
);

/* Login user */

export const loginUser = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;

    // check if email and password is entered by user
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    // finding user in database
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // check if password is correct or not
    const isPasswordMatched: boolean = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(res, 200, user);
  }
);

/* Logout user */

export const logoutUser = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out Successfully",
    });
  }
);

/* forgot password */

export const forgotPassword = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("done");

    // get reset token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create reset password url

    const resetUrl = `${req.protocol}//${req.get(
      "host"
    )}/api/v1/reset/${resetToken}`;

    const message = `Your password reset token is as follow: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "EShop Password Recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }
);

/* Reset Password */

export const resetPassword = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Hash URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "Password reset token is invalid or has been expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(res, 200, user);
  }
);

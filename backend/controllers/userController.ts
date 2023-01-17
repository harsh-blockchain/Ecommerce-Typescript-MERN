const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
import express from "express";
import { sendToken } from "../utils/sendToken";

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
    const isPasswordMatched: string = await user.comparePassword(password);

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

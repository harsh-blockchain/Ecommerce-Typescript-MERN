import ErrorHandler from "../utils/errorHandler";
const catchAsyncErrors = require("../middleware/catchAsyncError");
import express from "express";
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

dotenv.config({ path: "backend/config/config.env" });

interface IGetUserRequest extends express.Request {
  user: string;
}

export const isAuthenticated = catchAsyncErrors(
  async (
    req: IGetUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Login first to access this resource", 401));
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  }
);

/* now setting req.user.role typescript interface */

interface IGetRoleRequest extends express.Request {
  user: {
    role: string;
  };
}

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: IGetRoleRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

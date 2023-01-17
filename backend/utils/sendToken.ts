import express from "express";
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config({ path: "backend/config/config.env" });

export const sendToken = (
  res: express.Response,
  statusCode: number,
  user: any
) => {
  const token = user.getJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

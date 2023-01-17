import ErrorHandler from "../utils/errorHandler";
import express from "express";

module.exports = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  /* wrong mongodb id */

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  /* handling mongoose duplicate key error */

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  /* jwt error */

  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid. Try Again!!!";
    err = new ErrorHandler(message, 400);
  }

  /*  */

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

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

  /*  */

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

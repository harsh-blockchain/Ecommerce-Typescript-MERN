import express from "express";
const Product = require("../models/productModel");
import ErrorHandler from "../utils/errorHandler";
const catchAsyncErrors = require("../middleware/catchAsyncError");

/* create Product */

export const createProduct = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  }
);

/* get all products */

export const getAllProducts = catchAsyncErrors(
  async (req: express.Request, res: express.Response) => {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  }
);

/* update product */

export const updateProduct = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
  }
);

/* delete product */

export const deleteProduct = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product is deleted Successfully.",
    });
  }
);

/* get product details */

export const getProductDetails = catchAsyncErrors(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

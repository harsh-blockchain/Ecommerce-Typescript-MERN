import express from "express";
const Product = require("../models/productModel");

/* create Product */

export const createProduct = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

/* get all products */

export const getAllProducts = async (
  req: express.Request,
  res: express.Response
) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

/* update product */

export const updateProduct = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
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
};

/* delete product */

export const deleteProduct = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted Successfully.",
  });
};

/* get product details */

export const getProductDetails = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
};

const my_express = require("express");
const env_dotenv = require("dotenv");
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

env_dotenv.config({ path: "backend/config/config.env" });

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");

const productRouter = my_express.Router();

productRouter.route("/products").get(getAllProducts);
productRouter
  .route("/products/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);
productRouter
  .route("/products/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProduct);
productRouter
  .route("/products/:id")
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);
productRouter.route("/products/:id").get(getProductDetails);

module.exports = productRouter;

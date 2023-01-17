import { forgotPassword, resetPassword } from "./../controllers/userController";
const user_express = require("express");
const env = require("dotenv");
import { isAuthenticated } from "../middleware/auth";
import { authorizeRoles } from "../middleware/auth";

env.config({ path: "backend/config/config.env" });

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const user_Router = user_express.Router();

user_Router.route("/users/new").post(registerUser);
user_Router.route("/users/login").post(loginUser);
user_Router.route("/users/logout").get(isAuthenticated, logoutUser);

user_Router.route("/password/forgot").post(forgotPassword);
user_Router.route("/password/reset/:token").put(resetPassword);

module.exports = user_Router;

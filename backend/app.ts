const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

/* route imports */
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

/* error middleware */
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;

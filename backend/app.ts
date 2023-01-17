const express = require("express");

const app = express();

app.use(express.json());

/* route imports */
const productRoutes = require("./routes/productRoutes");

app.use("/api/v1", productRoutes);

/* error middleware */
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;

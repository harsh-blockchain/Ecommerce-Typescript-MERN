const my_app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

const connect_DB = require("./config/database");

connect_DB();

const server = my_app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

/* Handling uncaught exception */
process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

/* Handling unhandled promise rejection */

process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(typeof err);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

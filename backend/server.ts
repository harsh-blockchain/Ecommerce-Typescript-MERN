const my_app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

const connect_DB = require("./config/database");

connect_DB();

my_app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

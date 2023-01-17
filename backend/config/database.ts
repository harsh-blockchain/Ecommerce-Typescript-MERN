const mongoose = require("mongoose");
const my_dotenv = require("dotenv");

my_dotenv.config({ path: "backend/config/config.env" });

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;

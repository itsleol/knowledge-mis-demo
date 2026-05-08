const mongoose = require("mongoose");
const { mongoUri } = require("./config");

async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDb;

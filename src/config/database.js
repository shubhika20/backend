const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shubhika20:MJNSwGjZCXUwbWmN@chatting.obgy57o.mongodb.net/Chatting",
  );
};

module.exports = connectDB;

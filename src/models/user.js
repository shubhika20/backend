const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "transgender"].includes(value))
          throw new Error("Mention the correct gender");
      }, // runs only when creating new user, for already created users if I try to update the gender it will allow be to enter any value except these 3
    },
    photoUrl: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th/id/OIP.qsAOIYb4DjmoPKkP_uuttgHaF7?pid=Api&P=0&h=180",
    },
    about: {
      type: String,
      default: "User has signed up for the chatting app.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, //this adds created at and updated at keys by default with each new created user
  },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

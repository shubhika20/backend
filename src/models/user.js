const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
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
      }, // runs only when creating new user, for already created users. If I try to update the gender it will allow be to enter any value except these 3
    },
    photoUrl: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th/id/OIP.qsAOIYb4DjmoPKkP_uuttgHaF7?pid=Api&P=0&h=180",
      validate(url) {
        if (!validator.isURL(url))
          throw new Error("Upload picture in correct format");
      },
    },
    about: {
      type: String,
      default: "User has signed up for the chatting app.",
    },
    skills: {
      type: [String],
      validate(items) {
        if (items.length > 5)
          throw new Error("Cannot add more than five skills");
      },
    },
  },
  {
    timestamps: true, //this adds created at and updated at keys by default with each new created user
  },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

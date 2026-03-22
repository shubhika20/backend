const express = require("express");
const validateSignUpData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      ...req.body,
      password: passwordHash,
    });
    await user.save();
    res.send("Sign up successfull");
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid credentials");
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("No user found");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successful");
    } else throw new Error("Invalid credentials");
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = authRouter;

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); //used to parse the data we send from body in postman
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Sign up successfull");
  } catch (err) {
    res.status(400).send("User was not able to sign up");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection establishedd");
    app.listen(3000, () => {
      console.log("Server running successfull");
    });
  })
  .catch((err) => {
    console.error("Database could not be connected", err);
  });

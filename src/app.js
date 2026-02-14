const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");

const validator = require("validator");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");

const app = express();

app.use(express.json()); //used to parse the data we send from body in postman
app.use(cookieParser()); // to read the cookie coming from the request

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

//find user by email
app.get("/userByEmail", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (user) res.send("User found");
    else res.status(404).send("No user found with the given email id");
  } catch (err) {
    res.status(400).send("Error occured" + err.message);
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//delete a user
app.delete("/delete", async (req, res) => {
  const userId = req.body.id;
  try {
    //const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    if (user) res.send("User deleted successfully");
    else res.send("No user found with the given id");
  } catch (err) {
    res
      .status(400)
      .send("Something went wrong while performing deletetion" + err.message);
  }
});

//update a user
app.patch("/updateUser/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const updatedData = req.body;
    const allowed_fields = ["id", "password", "photoUrl", "skills", "about"];
    const isUpdatedAllowed = Object.keys(updatedData).every((key) =>
      allowed_fields.includes(key),
    );
    if (!isUpdatedAllowed)
      throw new Error("Update of non changeable field attempted"); // this also prevents that no new key is added to the db other than those mentioned in schema, like I cannot add salary
    const user = await User.findByIdAndUpdate({ _id: userId }, updatedData, {
      runValidators: true, //this runs the validations on all field if associated with them
    });
    if (user) res.send("User details updated successfully");
    else res.status(400).send("No user found with given user id");
  } catch (err) {
    res
      .status(400)
      .send("Something went wrong while updating user details " + err.message);
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

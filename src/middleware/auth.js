const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    const decodedMsg = await jwt.verify(token, "createjwt"); // decodedMsg is the data we sent in the jwt encryption (here id)
    const { _id } = decodedMsg;
    const user = await User.findById({ _id });
    req.user = user;
    if (!user) throw new Error("User not found");
    else next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};

module.exports = userAuth;

const express = require("express");
const userAuth = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

module.exports = requestRouter;

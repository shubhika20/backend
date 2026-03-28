const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
      //check if a request already exists between the two users
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already sent",
        });
      }

      //check if the user to whom the request is being sent exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "No such user exists" });
      }

      //check if the user is trying to send a request to themselves -> this is already handled in the pre save hook of the connectionRequest model, but we can also add an extra check here to avoid unnecessary database calls
      //   if (fromUserId.equals(toUserId)) {
      //     return res.status(400).json({
      //       message: "You cannot send a connection request to yourself",
      //     });
      //   }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " has " +
          status +
          " " +
          toUser.firstName +
          "'s connection request",
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(req.params.status)) {
        return res.status(400).json({
          message: "Invalid status type: " + req.params.status,
        });
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: req.params.requestId,
        toUserId: loggedInUser._id,
        status: "interested", // only interested requests can be accepted or rejected, ignored requests cannot be accepted or rejected
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "No such connection request exists",
        });
      }
      connectionRequest.status = req.params.status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request has been " + req.params.status,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR " + error.message);
    }
  },
);

module.exports = requestRouter;

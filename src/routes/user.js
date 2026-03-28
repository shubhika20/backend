const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

//Get all the pending connection requests for a user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills",
    ]); // this is to get the first name and last name of the user who has sent the connection request. We can also get other details of the user by adding those details in the array. For example if we want to get the photo url of the user who has sent the connection request then we can add "photoUrl" in the array.
    const requestsReceived = connectionRequests.map((request) => {
      return request.fromUserId;
    });
    res.send({
      message: "Data fetched successfully",
      data: requestsReceived,
    });
  } catch (err) {
    res
      .status(400)
      .send(
        "Something went wrong while fetching the pending requests" +
          err.message,
      );
  }
});

// To fetch all the accepted connection requests for logged in user
// Shubhika sent request to XYZ
// XYZ accepted the request. Now both Shubhika and XYZ should be able to see each other in their connections list.
//Similarly if XYZ sends request to ABC and ABC accepts the request then both XYZ and ABC should be able to see each other in their connections list.
// so if logged in user is XYZ then XYZ should be able to see both Shubhika and ABC in the connections list because both of them have accepted the connection request.
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ]);

    const connectionData = connectionRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      }
      return request.fromUserId;
    });
    res.send({
      message: "Connections fetched successfully",
      data: connectionData,
    });
  } catch (err) {
    res
      .status(400)
      .send(
        "Something went wrong while fetching the connections" + err.message,
      );
  }
});

module.exports = userRouter;

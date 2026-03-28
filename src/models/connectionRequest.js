const moongoose = require("mongoose");
const connectionRequestSchema = new moongoose.Schema(
  {
    fromUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User", // creates a reference to the User model, this is to establish a relationship between the ConnectionRequest and User models. This allows us to populate the fromUserId field with the user details when we fetch the connection requests for a user
      required: true,
    },
    toUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // this is to make sure that there is only one request between two users, no matter who is the sender and who is the receiver. This also optimizes the query performance when we are checking if a request already exists between two users

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
  return;
});

const ConnectionRequestModel = new moongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;

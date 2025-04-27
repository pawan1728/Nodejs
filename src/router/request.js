const express = require("express");
const { userAuth } = require("../moddleware/auth");
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
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status Type");
      }
      //check if toUserid exist in our db or not
      const userExist = await User.findOne({ _id: toUserId });
      if (!userExist) {
        throw new Error("User is not registered");
      }
      //if user alreacdy send request

      const connectionExist = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (connectionExist) {
        throw new Error("Connection already sent!!");
      }

      const ConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await ConnectionRequest.save();
      res.json({ message: "Connection Request made successfully" });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedinUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status not valid");
      }

      const findRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "interested",
      });

      if (!findRequest) {
        throw new Error("Request not found");
      }

      // Optional: Update the request status
      findRequest.status = status;
      let data = await findRequest.save();

      res.json({
        message: "Request updated successfully",
        data,
      });
    } catch (error) {
      res.status(404).send("ERROR: " + error.message);
    }
  }
);


module.exports = requestRouter;

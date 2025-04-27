const express = require("express");
const { userAuth } = require("../moddleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName gender age skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ message: "User get Successfully!", data: connectionRequest });
  } catch (error) {
    res.status(404).send("ERROR " + error.message);
  }
});

userRouter.get("/user/request/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionUser = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionUser.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "user list", data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * 10;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("toUserId fromUserId");

    const hideUsers = new Set();
    connectionRequest.forEach((user) => {
      hideUsers.add(user.fromUserId.toString());
      hideUsers.add(user.toUserId.toString());
    });

    const allUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    res.json({
      data: allUser,
    });
  } catch (error) {
    res.status.json({ message: error.message });
  }
});

module.exports = userRouter;

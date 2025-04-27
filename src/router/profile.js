const express = require("express");
const { userAuth } = require("../moddleware/auth");
const { validateEditUpdateDate } = require("../../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("user details" + user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditUpdateDate(req)) {
      throw new Error("Edit not allowed");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save()
    res.json({ message: "profile update successfully", date: user });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
module.exports = profileRouter;

const express = require("express");
const { userAuth } = require("../moddleware/auth");
const bryct = require("bcrypt");

const PasswordRouter = express.Router();

PasswordRouter.patch("profile/change-password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password, old_password } = req.body;
    const isValidOldPassword = await user.validatePassword(old_password);
    if (!isValidOldPassword) {
      throw new Error("Invalid Password");
    }
    const encryptedNewPassword = await bryct.hash(password, 10);
    user.password = encryptedNewPassword;
    user.save();
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Password update Sucessfully");
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});
module.exports = {
  PasswordRouter,
};

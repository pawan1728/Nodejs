const express = require("express");
const { validateSignUpData } = require("../../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user"); 

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, gender, age, skills } =
      req.body;
    let encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
      skills,
      gender,
      age,
    });
    let msg = await newUser.save();
    res.send(`User ${msg.firstName} added successfully`);
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.json({message:"Login Succussfully!!!",data:user});
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});
authRouter.post('/logout',(req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())});
    res.send("Logout Successfully !!!!")
})

module.exports = authRouter;

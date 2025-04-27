const jwt = require("jsonwebtoken");
const  User  = require("../models/user");

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    res.status(401).send("unAuthorized user");
  } else {
    next();
    console.log("this is checked");
  }
};


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token expire!!!!!!!!");
    }
    const decodeObj = await jwt.verify(token, "Dev@Tinder2025");
    const user = await User.findById(decodeObj._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: "+ error.message)
  }
};
module.exports = {
  adminAuth,
  userAuth,
};

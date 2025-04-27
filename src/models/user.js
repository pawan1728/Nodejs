const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength:3,
      maxLength:50
    },
    lastName: {
      type: String,
      maxLength:50
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true, 
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid Email Address: "+ value)
        }
      }
    },
    password: {
      type: String,
      required:true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Enter a strong Password: "+ value)
        }
      }
    },
    age: {
      type: Number,
      min:18
    },
    gender: {
      type: String,
      validate(value){
        if(!["male","female","other"].includes(value)){
          throw new Error("Gender is not valid")
        }
      }
    },
    skills:{
      type:[String],
      default: ["Javascript"]
    }
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const token =await jwt.sign({_id:this._id},'Dev@Tinder2025')
  return token;
}
userSchema.methods.validatePassword = async function (password) {
const passwordHash = await bcrypt.compare(password,this.password)
return passwordHash
}
module.exports =  mongoose.model("User", userSchema);

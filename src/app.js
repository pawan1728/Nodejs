const express = require("express");
const { connectDB } = require("../src/config/database");
var cookieParser = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const { PasswordRouter } = require("./router/chnagePassword");
const userRouter = require("./router/user");
const cors = require('cors')

const app = express();

app.use(cors({
  origin:"http://localhost:5173/",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',PasswordRouter)
app.use('/',userRouter)

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(1234);
  })
  .catch((err) => console.log("error occure", err.message));

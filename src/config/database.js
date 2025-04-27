const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pawan1728:hoIRqQQuC8fjO1Dp@nodejs.vvufs5u.mongodb.net/devTinder"
  );
};

module.exports = {
    connectDB
}

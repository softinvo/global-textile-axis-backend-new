const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB is connected successfully !");
    })
    .catch((err) => {
      console.log("DB is not connected");
      console.error(err);
      process.exit(1);
    });
};

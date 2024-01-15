const mongoose = require("mongoose");

mongoose.set("debug", false);
mongoose.set("strictQuery", true);

const databaseConnection = function (callback) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("database connected");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = databaseConnection;

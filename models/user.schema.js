const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
      require: [true, "username is required"],
    },
    email: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
      require: [true, "email is required"],
    },
    password: {
      type: String,
      require: [true, "password is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

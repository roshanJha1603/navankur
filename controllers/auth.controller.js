const { catchAsync } = require("../helper/catchAsyncWrapper");
const { httpStatusCodes } = require("../helper/httpStatusCodes");
const userModel = require("../models/user.schema");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../helper/sendEmail");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

const userSignUp = catchAsync(async function (req, res, next) {
  const { username, email, password } = req.body; //Add validations

  const checkIfUserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (checkIfUserExist) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "username or email already exist",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await userModel({
    username,
    email,
    password: hashedPassword,
  }).save();

  if (!newUser) {
    return res.status(httpStatusCodes.INTERNAL_SERVER).json({
      success: false,
      error: true,
      message: "Something went wrong while creating user details",
    });
  }

  return res.status(httpStatusCodes.CREATED).json({
    success: true,
    error: false,
    message: "Registration successful",
  });
});

const userLogin = catchAsync(async function (req, res, next) {
  const { username, password } = req.body;

  const userDetails = await userModel.findOne({ username });
  if (!userDetails) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: true,
      error: false,
      message: "username not found !",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, userDetails.password);
  if (!isPasswordMatch) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: true,
      error: false,
      message: "Invalid password!",
    });
  }

  req.session.user = { id: userDetails._id, username: userDetails.username };

  return res.status(httpStatusCodes.OK).json({
    success: true,
    error: false,
    message: "Login Successful",
  });
});

const userLogout = catchAsync(async function (req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(httpStatusCodes.INTERNAL_SERVER).json({
        success: false,
        error: true,
        message: "Something went wrong while destroying sessions!",
      });
    } else {
      return res.status(httpStatusCodes.OK).json({
        success: true,
        error: false,
        message: "Logout Successful !",
      });
    }
  });
});

const forgotPassword = catchAsync(async function (req, res, next) {
  const { username } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: true,
      error: false,
      message: "username not found !",
    });
  }

  const secret = process.env.JWT_SECRET + user.password;
  const payload = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:5000/auth/reset-password/${user._id}/${token}`;

  const sendEmailLink = sendEmail(user.email, link);

  if (!sendEmailLink) {
    return res.status(httpStatusCodes.INTERNAL_SERVER).json({
      success: true,
      error: false,
      message: "Something went wrong while sharing password reset link. ",
    });
  }

  return res.status(httpStatusCodes.OK).json({
    success: true,
    error: false,
    message: "password reset link shared on you email",
  });
});

const resetPassword = catchAsync(async function (req, res, next) {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  if (password !== password2) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "Passwords din't matched !",
    });
  }

  const user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      success: false,
      error: true,
      message: "Invalid user Id",
    });
  }

  const secret = process.env.JWT_SECRET + user.password;
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return res.status(httpStatusCodes.UNAUTHORIZATION).json({
        success: false,
        error: true,
        message: "Unauthorized access",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updateUserDetails = await userModel.updateOne(
        { _id: id },
        {
          $set: { password: hashedPassword },
        }
      );

      if (!updateUserDetails.modifiedCount) {
        return res.status(httpStatusCodes.INTERNAL_SERVER).json({
          success: false,
          error: true,
          message: "Something went wrong while updating password.",
        });
      }
    }
  });

  return res.status(httpStatusCodes.OK).json({
    success: true,
    error: false,
    message: "password updated successful",
  });
});

module.exports = {
  userSignUp,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
};

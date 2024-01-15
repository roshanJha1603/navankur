const CaptureError = require("../error");

const catchAsync = function (fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      //For development
      //   throw new CaptureError("oh ho!", err);

      //   For production
      return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    });
  };
};

module.exports = { catchAsync };

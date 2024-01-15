const { validationResult } = require("express-validator");
const { httpStatusCodes } = require("../helper/httpStatusCodes");

const validateErrors = function (req, res, next) {
  /**
   * validate the request
   */
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(httpStatusCodes.INVALID_INPUT).json({
      error: true,
      success: false,
      error: errors.array(),
      status: httpStatusCodes.INVALID_INPUT,
    });
  }

  next();
};

module.exports = { validateErrors };

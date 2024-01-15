const { body } = require("express-validator");
const { validateErrors } = require("./validator");

exports.passwordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 15 })
    .withMessage("Password must have a length between 6 and 15 characters")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character"),
  (req, res, next) => {
    validateErrors(req, res, next);
  },
];

const { httpStatusCodes } = require("../helper/httpStatusCodes");

const authenticateUser = (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.render("user-login");
  }
  next();
};

module.exports = { authenticateUser };

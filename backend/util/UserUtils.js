const UserModel = require("../models/UserModel");
const { errorHandler } = require("./RouteUtils");

/**
 * Middleware to validate that the current
 *   user is an admin.
 */
const isAdmin = () => (req, res, next) =>
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user.admin) res.status(401).json({ error: "Access denied." });
      else next();
    })
    .catch(errorHandler(res));

module.exports = { isAdmin };

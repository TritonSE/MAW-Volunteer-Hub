const UserModel = require("../models/UserModel");
const { errorHandler } = require("./RouteUtils");

/**
 * Sanitizes the user schema to provide only
 *   public-facing information.
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  admin: user.admin,
  profilePicture: user.profilePicture,
  profilePictureModified: user.profilePictureModified,
  roles: user.roles,
  joinDate: user.joinDate,
  createdAt: user.createdAt,
});

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

module.exports = { sanitizeUser, isAdmin };

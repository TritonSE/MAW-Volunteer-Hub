/*
 * RouteUtils.js: Utilities for writing routes more cleanly
 */

const mongoose = require("mongoose");
const config = require("../config");
const log = require("./Logger");

/**
 * A simple parameter validator middleware,
 *   verifying that the given body parameters
 *   are non-null and non-empty.
 */
const validate =
  (body_params = [], query_params = []) =>
  (req, res, next) => {
    const body_valid = body_params.every((p) => {
      if (!req.body[p] || req.body[p].trim() === "") {
        if (config.app.env === "development")
          res.status(400).json({ error: `"${p}" missing from body.` });
        else res.status(401).json({ error: "Access denied." });
        return false;
      }
      return true;
    });
    const params_valid = query_params.every((p) => {
      if (!req.params[p] || req.params[p].trim() === "") {
        if (config.app.env === "development")
          res.status(400).json({ error: `"${p}" missing from params.` });
        else res.status(401).json({ error: "Access denied." });
        return false;
      }
      return true;
    });

    if (body_valid && params_valid) next();
  };

/**
 * A simple error handler that prints the
 *   error to the screen if in development.
 */
const errorHandler = (res) => (e) => {
  log.error(e);
  if (config.app.env === "development") res.status(500).json({ error: e.toString() });
  else res.status(500).json({ error: "Internal server error." });
};

/**
 * Middleware to validate the mongodb _id
 *   value stored in the request parameters.
 */
const idParamValidator =
  (only_if_present = false) =>
  (req, res, next) => {
    if (only_if_present && !req.params.id) next();
    else if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) next();
    else res.status(400).json({ error: "Invalid user ID parameter." });
  };

/**
 * A middleware to check whether the current
 *   user is an admin.
 */
const adminValidator = (req, res, next) => {
  if (req.user && req.user.admin) next();
  else res.status(403).json({ error: "Access denied." });
};

module.exports = {
  validate,
  errorHandler,
  idParamValidator,
  adminValidator,
};

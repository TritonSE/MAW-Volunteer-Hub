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
      if (!req.body[p] || (typeof req.body[p] === "string" && req.body[p].trim() === "")) {
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
 * Middleware to validate the mongodb _id
 *   value stored in the request parameters.
 */
const idParamValidator =
  (only_if_present = false, kind = "user") =>
  (req, res, next) => {
    if (only_if_present && !req.params.id) next();
    else if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) next();
    else res.status(400).json({ error: `Invalid ${kind} ID parameter.` });
  };

/**
 * A middleware to check whether the current
 *   user is an admin. Passes when the user
 *   is a primary or secondary admin.
 */
const adminValidator = (req, res, next) => {
  // don't want to just do req.user.admin because returns true if >= 3)
  if (req.user && (req.user.admin === 1 || req.user.admin === 2)) next();
  else res.status(403).json({ error: "Access denied." });
};

/**
 * A middleware to check whether the current
 *   user is a primary admin.
 */
const primaryAdminValidator = (req, res, next) => {
  if (req.user && req.user.admin === 2) next();
  else res.status(403).json({ error: "Access denied." });
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

module.exports = {
  validate,
  idParamValidator,
  adminValidator,
  primaryAdminValidator,
  errorHandler,
};

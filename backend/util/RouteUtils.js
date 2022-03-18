/*
 * RouteUtils.js: Utilities for writing routes more cleanly
 */

const mongoose = require("mongoose");

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
        res.status(400).json({ error: `"${p}" missing from body` });
        return false;
      }
      return true;
    });
    const params_valid = query_params.every((p) => {
      if (!req.params[p] || req.params[p].trim() === "") {
        res.status(400).json({ error: `"${p}" missing from params` });
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
  if (process.env.NODE_ENV === "dev") console.error(e);
  res.status(500).json({ error: e.toString() });
};

/**
 * Middleware to validate the mongodb _id
 *   value stored in the request parameters.
 */
const idParamValidator =
  (only_if_present = false) =>
  (req, res, next) => {
    if (!req.params.id && only_if_present) next();
    else if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID parameter." });
    } else next();
  };

module.exports = {
  validate,
  errorHandler,
  idParamValidator,
};

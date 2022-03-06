/*
 * RouteUtils.js: Utilities for writing routes more cleanly
 */

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
  log.error(e);
  if (config.app.env === "development") res.status(500).json({ error: e.toString() });
  else res.status(500).json({ error: true });
};

module.exports = {
  validate,
  errorHandler,
};

/*
 * RouteUtils.js: Utilities for writing routes more cleanly
 */

/**
 * A simple parameter validator middleware,
 *   verifying that the given body parameters
 *   are non-null and non-empty.
 */
const validate =
  (body_params = [], query_params = [], full_error = true) =>
  (req, res, next) => {
    const body_valid = body_params.every((p) => {
      if (!req.body[p] || req.body[p].trim() === "") {
        if (full_error) res.status(400).json({ error: `"${p}" missing from body` });
        else res.status(401).json({ error: "Access denied" });
        return false;
      }
      return true;
    });
    const params_valid = query_params.every((p) => {
      if (!req.params[p] || req.params[p].trim() === "") {
        if (full_error) res.status(400).json({ error: `"${p}" missing from params` });
        else res.status(401).json({ error: "Access denied" });
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
const errorHandler =
  (res, full_error = true) =>
  (e) => {
    if (process.env.NODE_ENV === "dev") console.error(e);
    if (full_error) res.status(500).json({ error: e.toString() });
    else res.status(401).json({ error: "Access denied" });
  };

module.exports = {
  validate,
  errorHandler,
};

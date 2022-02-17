/**
 * A simple parameter validator middleware,
 *   verifying that the given body parameters
 *   are non-null and non-empty.
 */

module.exports =
  (body_params = [], query_params = []) =>
  (req, res, next) => {
    const body_valid = body_params.every((p) => {
      if (!req.body[p] || req.body[p].trim() === "") {
        res.status(400).json({ error: true });
        return false;
      }
      return true;
    });
    const params_valid = query_params.every((p) => {
      if (!req.params[p] || req.params[p].trim() === "") {
        res.status(400).json({ error: true });
        return false;
      }
      return true;
    });

    if (body_valid && params_valid) next();
  };

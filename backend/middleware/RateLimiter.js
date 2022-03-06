/**
 * RateLimiter.js: Rate limiting/DDoS protection
 */

const { RateLimiterMemory } = require("rate-limiter-flexible");

const log = require("../util/Logger");

/* No more than 16 requests per second, per IP */
const rate_limiter = new RateLimiterMemory({
  points: 16,
  duration: 1,
});

module.exports = (req, res, next) => {
  rate_limiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      log.warn(`IP address ${req.ip} has made too many requests.`);
      res.status(429).send({ error: "Too many requests" });
    });
};

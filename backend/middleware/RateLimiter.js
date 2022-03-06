/**
 * RateLimiter.js: Rate limiting/DDoS protection
 */

const { RateLimiterMemory } = require("rate-limiter-flexible");

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
      res.status(429).send({ error: "Too many requests" });
    });
};

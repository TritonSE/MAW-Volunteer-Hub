/*
 * SanityChecks.js: Preflight checks
 */

const fs = require("fs");

const config = require("../config");
const log = require("./Logger");

module.exports = () => {
  if (config.app.env === "development") {
    const stats = fs.fstatSync(1);
    if (stats && !stats.isFIFO()) {
      const msg =
        'Running in development environment, but logs are not being passed through pino-pretty. Install it with \x1b[32m"npm i pino-pretty -g"\x1b[0m, then re-run this command as \x1b[33m"node index.js | pino-pretty"\x1b[0m for pretty-printed logs.';

      console.log(`Warning: ${msg}\n`);
      log.warn(msg);
    }
  }

  if (
    config.amazons3.bucket_name === "" ||
    config.amazons3.bucket_region === "" ||
    config.amazons3.access_key === "" ||
    config.amazons3.secret_key === ""
  ) {
    log.fatal("S3 bucket information is empty. Did you forget to add a .env file?");
  }

  if (config.app.env !== "development" && config.auth.jwt_secret === "super secret") {
    log.fatal("Running in production environment, but JWT secret is its default value. Change it!");
  }

  /* TODO: More checks */
};

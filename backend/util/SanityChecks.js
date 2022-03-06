/*
 * SanityChecks.js: Preflight checks
 */

const config = require("../config");
const log = require("./Logger");

module.exports = () => {
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

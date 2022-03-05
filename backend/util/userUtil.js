const Buffer = require("buffer/").Buffer;

const AUTH_HEADER = "authorization";

// This file is from the source code of PassportJS
const re = /(\S+)\s+(\S+)/;
function parseAuthHeader(hdrValue) {
  if (typeof hdrValue !== "string") {
    return null;
  }
  const matches = hdrValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
}

// helper function-- retrieves JWT token then parses it to get user id of logged in user
// modifed PassportJS's fromAuthHeaderWithScheme function
// no longer needed because we can retrieve user id from req.user._id;
function idOfCurrentUser(req) {
  // retreives JWT token
  // var token;
  const auth_params = parseAuthHeader(req.headers[AUTH_HEADER]);
  const token = auth_params.value;
  // parses JWT Token
  const base64Payload = token.split(".")[1];
  const payload = Buffer.from(base64Payload, "base64");
  const answer = JSON.parse(payload.toString());
  const userId = answer["user"]["_id"];
  return userId;
}

module.exports = {
  idOfCurrentUser,
  parse: parseAuthHeader,
};

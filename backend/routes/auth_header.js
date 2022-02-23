// This file is from the source code of PassportJS

const re = /(\S+)\s+(\S+)/;

function parseAuthHeader(hdrValue) {
  if (typeof hdrValue !== "string") {
    return null;
  }
  const matches = hdrValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
}

module.exports = {
  parse: parseAuthHeader,
};

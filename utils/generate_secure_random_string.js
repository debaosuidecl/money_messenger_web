var srs = require("secure-random-string");

exports.securestring = (length) => {
  return srs({ length });
};

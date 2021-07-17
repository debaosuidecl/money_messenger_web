const bcrypt = require("bcryptjs");

exports.saltifytext = async function (text) {
  const salt = await bcrypt.genSalt(10);

  const saltified = await bcrypt.hash(text, salt);

  return saltified;
};

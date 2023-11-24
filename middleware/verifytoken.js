const jwt = require("jsonwebtoken");

const config = require("config");

module.exports = function (req, res, next) {
  //Get Token from header
  const token = req.header("x-auth-token"); // extract token from the request header

  // console.log(token);
  if (!token) {
    // return a` 401 response (No authorization);

    return res.status(400).json({ msg: "No token, authorization denied" });
  }

  try {
    // we have to decode token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // decoded token
    // console.log(decoded);
    // return res.json({ decoded });
    req.convertor = decoded.name; // the structure of the decoded can be find in jwt.io we can extract our user id from the decoded json
    // // console.log('going next');
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Token is not valid" });
  }
};

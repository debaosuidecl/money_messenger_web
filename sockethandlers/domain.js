// @ts-nocheck
const jwt = require("jsonwebtoken");
const config = require("config");
const dotenv = require("dotenv");

dotenv.config();
function checkAuth(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.emit("user not authorized");
    return console.log("user not authorized");
  }

  try {
    // we have to decode token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    socket.user = decoded.user;
    next();
  } catch (error) {
    socket.emit("user not authorized");

    return console.log("user not authorized");
  }
}
module.exports = {
  checkAuth,
};

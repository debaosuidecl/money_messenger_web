//@ts-nocheck

var Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.REDIS_PORT;
const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;

var redis = new Redis({
  port,
  host,
  password,
  tls: true,
});

module.exports = redis;

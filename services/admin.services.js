const User = require("../models/User");

async function findusers(query, limit, page) {
  try {
    const domains = await User.find(query)
      .limit(limit)
      .skip(limit * page)
      .select("-password")
      .sort("-date");

    return domains;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  findusers,
};

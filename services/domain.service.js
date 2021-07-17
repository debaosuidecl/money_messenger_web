const Domain = require("../models/Domain");
const NamecheapCredentials = require("../models/NamecheapCredentials");

async function findnamecheapcredential(query) {
  try {
    const namecheapcred = await NamecheapCredentials.findOne(query).lean();

    if (!namecheapcred) return false;

    return namecheapcred;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function finddomains(query, limit, page = 0) {
  try {
    const domains = await Domain.find(query)
      .limit(limit)
      .skip(limit * page)
      .populate("traffic dataowner domaingroup")
      .sort("-date");

    console.log(domains);

    return domains;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createNamecheapConfig(details) {
  try {
    const namecheapcred = new NamecheapCredentials(details);

    await namecheapcred.save();

    return namecheapcred;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updatenamecheapcredentials(query, update, type = "set") {
  const campaign = await NamecheapCredentials.findOneAndUpdate(
    query,
    {
      [`$${type}`]: update,
    },
    {
      new: true,
    }
  );

  if (!campaign) {
    return false;
  }

  return campaign;
}
module.exports = {
  findnamecheapcredential,
  finddomains,
  createNamecheapConfig,
  updatenamecheapcredentials,
};

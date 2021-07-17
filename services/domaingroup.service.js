const DomainGroup = require("../models/DomainGroup");

async function finddomaingroups(query, limit, page = 0) {
  try {
    const domaingroups = await DomainGroup.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .populate("dataowner traffic")
      .lean();

    return domaingroups;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createdomaingroup(details) {
  try {
    const domaingroup = new DomainGroup(details);

    const result = await domaingroup.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatedomaingroup(query, update, type) {
  try {
    const result = await DomainGroup.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}
async function deletedomaingroup(query) {
  try {
    const result = await DomainGroup.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOnedomaingroup(query) {
  try {
    const domaingroup = await DomainGroup.findOne(query).lean();

    if (!domaingroup) {
      return false;
    }
    return domaingroup;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  finddomaingroups,
  createdomaingroup,
  deletedomaingroup,
  findOnedomaingroup,
  findAndUpdatedomaingroup,
};

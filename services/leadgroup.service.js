const LeadGroup = require("../models/LeadGroup");

async function findleadgroups(query, limit, page = 0) {
  try {
    const leadgroups = await LeadGroup.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      //   .populate("dataowner traffic")
      .lean();

    return leadgroups;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createleadgroup(details) {
  try {
    const leadgroup = new LeadGroup(details);

    const result = await leadgroup.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdateleadgroup(query, update, type) {
  try {
    const result = await LeadGroup.findOneAndUpdate(
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
async function deleteleadgroup(query) {
  try {
    const result = await LeadGroup.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOneleadgroup(query) {
  try {
    const leadgroup = await LeadGroup.findOne(query);

    if (!leadgroup) {
      return false;
    }
    return leadgroup;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  findleadgroups,
  createleadgroup,
  deleteleadgroup,
  findOneleadgroup,
  findAndUpdateleadgroup,
};

const SendingPhonesGroup = require("../models/SendingPhonesGroup");

async function findsendingphonegroups(query, limit, page = 0) {
  try {
    const sendingphonegroups = await SendingPhonesGroup.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return sendingphonegroups;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createsendingphonegroup(details) {
  try {
    const sendingphonegroup = new SendingPhonesGroup(details);

    const result = await sendingphonegroup.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatesendingphonegroup(query, update, type) {
  try {
    const result = await SendingPhonesGroup.findOneAndUpdate(
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
async function deletesendingphonegroup(query) {
  try {
    const result = await SendingPhonesGroup.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOnesendingphonegroup(query) {
  try {
    const sendingphonegroup = await SendingPhonesGroup.findOne(query).lean();

    if (!sendingphonegroup) {
      return false;
    }
    return sendingphonegroup;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  findsendingphonegroups,
  createsendingphonegroup,
  deletesendingphonegroup,
  findOnesendingphonegroup,
  findAndUpdatesendingphonegroup,
};

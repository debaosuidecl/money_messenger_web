const SMSRoute = require("../models/SMSRoute");

async function findsmsroutes(query, limit, page = 0) {
  try {
    const smsroutes = await SMSRoute.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return smsroutes;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createsmsroute(details) {
  try {
    const smsroute = new SMSRoute(details);

    const result = await smsroute.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatesmsroute(query, update, type) {
  try {
    const result = await SMSRoute.findOneAndUpdate(
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
async function deletesmsroute(query) {
  try {
    const result = await SMSRoute.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOnesmsroute(query) {
  try {
    const smsroute = await SMSRoute.findOne(query).lean();

    if (!smsroute) {
      return false;
    }
    return smsroute;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  findsmsroutes,
  createsmsroute,
  deletesmsroute,
  findOnesmsroute,
  findAndUpdatesmsroute,
};

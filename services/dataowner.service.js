const Dataowner = require("../models/Dataowner");

async function finddataowners(query, limit, page = 0) {
  try {
    const dataowners = await Dataowner.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return dataowners;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createdataowner(details) {
  try {
    const dataowner = new Dataowner(details);

    const result = await dataowner.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatedataowner(query, update, type) {
  try {
    const result = await Dataowner.findOneAndUpdate(
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
async function deletedataowner(query) {
  try {
    const result = await Dataowner.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOnedataowner(query) {
  try {
    const dataowner = await Dataowner.findOne(query).lean();

    if (!dataowner) {
      return false;
    }
    return dataowner;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  finddataowners,
  createdataowner,
  deletedataowner,
  findOnedataowner,
  findAndUpdatedataowner,
};

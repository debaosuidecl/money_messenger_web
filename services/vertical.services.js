const Verticals = require("../models/Verticals");

async function findVerticals(query, limit, page = 0) {
  try {
    const verticals = await Verticals.find(query)
      .sort("-date")
      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return verticals;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function createVertical(details) {
  try {
    const vertical = new Verticals(details);

    const result = await vertical.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdateVertical(query, update, type) {
  try {
    const result = await Verticals.findOneAndUpdate(
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
async function deleteVertical(query) {
  try {
    const result = await Verticals.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function findOneVertical(query) {
  try {
    const vertical = await Verticals.findOne(query).lean();

    if (!vertical) {
      return false;
    }
    return vertical;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  findVerticals,
  createVertical,
  deleteVertical,
  findOneVertical,
  findAndUpdateVertical,
};

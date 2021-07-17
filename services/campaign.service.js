const Campaigns = require("../models/Campaigns");
const DomainGroup = require("../models/DomainGroup");
const LeadGroup = require("../models/LeadGroup");
const MessageSchema = require("../models/MessageSchema");
const SMSRoute = require("../models/SMSRoute");
const mongoose = require("mongoose");
async function findCampaign(query) {
  const campaign = await Campaigns.findOne(query).lean();

  if (!campaign) {
    return false;
  }

  return campaign;
}

async function findcampaigns(query, limit, page = 0) {
  try {
    const campaigns = await Campaigns.find(query)
      .sort("-date")
      .populate("leadgroup domaingroup smsroute dataowner vertical")

      .limit(limit)
      .skip(parseInt(limit) * page)
      .lean();

    return campaigns;
  } catch (error) {
    console.error(error);
    return false;
  }
}
function findEntryById({ model, id, name, user }) {
  return new Promise(async (resolve, reject) => {
    // const doc = await
    let doc;
    if (name === "Domain Group") {
      doc = await model.findById(id).populate("dataowner traffic");
    } else {
      doc = await model.findById(id);
    }
    // const doc = await model.findById("60bb8bd6808f6e512c358c8f");
    if (!doc)
      reject({
        errors: [{ msg: `${name} not found` }],
      });

    if (doc.user != user)
      reject({
        errors: [{ msg: `You are unauthorized to make this action` }],
      });
    resolve(doc);
  });
}
async function bulkfindmodels(
  domaingroup,
  leadgroup,
  messageschema,
  route,
  user
) {
  let entries = [
    {
      id: domaingroup,
      model: DomainGroup,
      name: "Domain Group",
      user: user,
    },
    {
      id: leadgroup,
      model: LeadGroup,
      name: "Lead Group",
      user: user,
    },
    {
      id: messageschema,
      model: MessageSchema,
      name: "Message schema",
      user: user,
    },
    { id: route, model: SMSRoute, name: "Sms route", user: user },
  ];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].id;

    if (!entry) {
      console.log(entry, i);
      return false;
    }

    var ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(entry)) {
      return false;
      // return res
      //   .status(400)
      //   .json({ errors: [{ msg: `Entry was invalid: ${entry}` }] });
    }
  }

  let [domaingroupdoc, leadgroupdoc, messageschemadoc, routedoc] = [0, 0, 0, 0];

  try {
    [domaingroupdoc, leadgroupdoc, messageschemadoc, routedoc] =
      await Promise.all(entries.map(findEntryById));

    // console.log(
    //   [domaingroupdoc, leadgroupdoc, messageschemadoc, routedoc],
    //   102
    // );
    return [domaingroupdoc, leadgroupdoc, messageschemadoc, routedoc];
  } catch (e) {
    console.log(e, "an aerror occured");
    return false;
  }
}
async function createcampaign(details) {
  try {
    const campaign = new Campaigns(details);

    const result = await campaign.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function findAndUpdatecampaign(query, update, type) {
  try {
    const result = await Campaigns.findOneAndUpdate(
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
async function deletecampaign(query) {
  try {
    const result = await Campaigns.findOneAndDelete(query);

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}

async function countcampaigns(query) {
  try {
    const res = await Campaigns.countDocuments(query);

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function aggregatecampaign(_match, _property, action = "sum") {
  try {
    const res = await Campaigns.aggregate([
      {
        $match: _match,
      },
      {
        $group: { _id: null, [_property]: { [`$${action}`]: `$${_property}` } },
      },
    ]);

    if (res.length <= 0) {
      // console.log("aggregated empty array");
      return 0;
    }

    return res[0][_property];
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  findCampaign,
  findcampaigns,
  createcampaign,
  countcampaigns,
  findAndUpdatecampaign,
  aggregatecampaign,
  deletecampaign,
  bulkfindmodels,
};

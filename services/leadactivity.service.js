const redisclient = require("../redisfunctions/redisclient");
const LeadActivity = require("../models/leadactivity.model");
const Campaigns = require("../models/Campaigns");
const User = require("../models/User");
const LeadsTotal = require("../models/LeadUndeduped");

async function aggregateleadactivity(_match, _property, action = "sum") {
  try {
    const res = await LeadActivity.aggregate([
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

async function countleadactivity(query) {
  try {
    const res = await LeadActivity.countDocuments(query);

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function extractidfromredis(shortid) {
  return new Promise(async (resolve, reject) => {
    redisclient.hget("short_id_map", shortid, (err, reply) => {
      console.log(reply, err, 14);
      if (err) {
        reject(err);
      }
      if (reply) {
        const { leadid, campaignid } = JSON.parse(reply);
        resolve([leadid, campaignid]);
      }

      reject("no reply");
    });
  });
}

async function findLead(query) {
  const lead = await LeadsTotal.findOne(query).lean();
  if (!lead) {
    return false;
  }
  return lead;
}
async function createClicker(
  leadid,
  firstname,
  lastname,
  phone,
  address,
  city,
  zip,
  state,
  campaignid,
  dataowner,
  vertical,
  leadgroup,
  domaingroup,
  smsroute,
  messageschema,
  user,
  OS,
  device,
  browser,
  ip,
  servername
) {
  const clicker = new LeadActivity({
    lead: leadid,
    firstname,
    lastname,
    phone,
    address,
    city,
    zip,
    state,
    campaign: campaignid,
    dataowner,
    vertical,
    leadgroup,
    domaingroup,
    smsroute,
    messageschema,
    user,
    OS,
    device,
    browser,
    ip,
    servername,
    // status,
  });

  await clicker.save();

  return clicker;
}

async function updatecampaign(query, update, type) {
  const campaign = await Campaigns.findOneAndUpdate(
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
async function updateLeadActivity(query, update, type) {
  const leadactivity = await LeadActivity.findOneAndUpdate(
    query,
    {
      [`$${type}`]: update,
    },
    {
      new: true,
    }
  );

  if (!leadactivity) {
    return false;
  }

  return leadactivity;
}

async function findUser(query) {
  try {
    const user = await User.findOne(query).lean();

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = {
  // saveclicker,
  createClicker,
  extractidfromredis,
  findUser,
  findLead,
  updatecampaign,
  updateLeadActivity,
  aggregateleadactivity,
  countleadactivity,
};

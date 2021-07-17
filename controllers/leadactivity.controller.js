const {
  findCampaign,
  countcampaigns,
  findcampaigns,
} = require("../services/campaign.service");
const {
  extractidfromredis,
  createClicker,
  updatecampaign,
  findUser,
  findLead,
  updateLeadActivity,
  aggregateleadactivity,
  countleadactivity,
} = require("../services/leadactivity.service");
const { findoneuser, countuserdocuments } = require("../services/user.service");
const { errorreturn } = require("../utils/returnerrorschema");

let socket;

// @ts-ignore
socket = require("socket.io-client")(
  "http://localhost:" + process.env.campaignserver1
);

async function clickerhandler(req, res) {
  const { id } = req.params;
  let { OS, device, browser, ip } = req.query;

  if (!id) {
    return res.status(404).send(null);
  }

  try {
    const [leadid, campaignid] = await extractidfromredis(id);
    // send data to user
    res.json({
      leadid,
      campaignid,
    });

    // find lead by leadid

    const [lead, campaign] = await Promise.all([
      findLead({
        _id: leadid,
      }),
      findCampaign({
        _id: campaignid,
      }),
    ]);

    if (!lead || !campaign) {
      return console.log("no lead or campaign", { lead, campaign });
    }

    // find user

    let servername = "";

    try {
      const user = await findoneuser({ _id: campaign.user });

      servername = user.servername;
    } catch (error) {
      console.log(error);
    }

    const campaign_update_value = await updatecampaign(
      {
        _id: campaignid,
      },
      {
        clickcount: 1,
      },
      "inc"
    );

    socket.emit("status_click", campaign_update_value);

    const createdclicker = await createClicker(
      leadid,
      lead.firstname || "",
      lead.lastname || "",
      lead.phone || "",
      lead.address || "",
      lead.city || "",
      lead.zip || "",
      lead.state || "",
      campaignid,
      campaign.dataowner || "",
      campaign.vertical || "",
      campaign.leadgroup || "",
      campaign.domaingroup || "",
      campaign.smsroute || "",
      campaign.messageschema || "",
      campaign.user,
      OS,
      device,
      browser,
      ip,
      servername
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(null);
  }
}

async function conversionhandler(req, res) {
  const { userid } = req.params;

  const { clickid, payout } = req.query;

  try {
    const user = await findUser({
      _id: userid,
    });

    if (!user) {
      console.log("user not found: ", user);
      return res.sendStatus(404);
    }

    // find lead id from redis

    let leadid, campaignid;

    try {
      [leadid, campaignid] = await extractidfromredis(clickid);
    } catch (error) {
      console.log(error);

      return res.sendstatus(400);
    }

    res.sendStatus(200);
    // find lead by lead id

    const [lead, campaign] = await Promise.all([
      findLead({
        _id: leadid,
      }),
      findCampaign({
        _id: campaignid,
      }),
    ]);

    if (!lead || !campaign) {
      return console.log("no lead or campaign", { lead, campaign });
    }

    // update  lead activity

    console.log(campaignid, leadid, userid, 136);
    const leadactivty = await updateLeadActivity(
      {
        campaign: campaignid,
        user: userid,
        lead: leadid,
      },
      {
        converter: true,
        payout: parseFloat(payout),
      },
      "set"
    );

    if (!leadactivty) {
      return console.log(
        "lead activity not found for conversion",
        new Date(),
        req.query,
        150
      );
    }

    const campaign_update_value = await updatecampaign(
      {
        _id: campaignid,
      },
      {
        conversioncount: 1,
        payout: parseFloat(payout),
      },
      "inc"
    );

    socket.emit("status_conversion", campaign_update_value);

    // increase conversion value
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function conversionamounthandler(req, res) {
  try {
    let { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).send({
        errors: [
          {
            msg: " Start and End Dates are Required!",
          },
        ],
      });
    }

    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    const payoutRange = await aggregateleadactivity(
      {
        date: { $gte: start, $lt: end },
        user: req.user.id,
        converter: true,
        payout: { $ne: 0 },
      },
      "payout"
    );

    if (!payoutRange && payoutRange !== 0) {
      return res.status(400).send({
        errors: [
          {
            msg: " Error fetching details",
          },
        ],
      });
    }

    // console.log(payoutRange);

    res.send({ msg: payoutRange });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      errors: [
        {
          msg: " Server Error Occured, Please try again later",
        },
      ],
    });
  }
}
async function conversioncounthandler(req, res) {
  try {
    let { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).send({
        errors: [
          {
            msg: " Start and End Dates are Required!",
          },
        ],
      });
    }

    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    const conversioncount = await countleadactivity({
      date: { $gte: start, $lte: end },
      user: req.user.id,
      converter: true,
      payout: { $ne: 0 },
    });

    if (!conversioncount && conversioncount !== 0) {
      return res.status(400).send({
        errors: [
          {
            msg: " Error fetching details",
          },
        ],
      });
    }

    console.log(conversioncount);

    res.send({ msg: conversioncount });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      errors: [
        {
          msg: " Server Error Occured, Please try again later",
        },
      ],
    });
  }
}

async function clickcounthandler(req, res) {
  try {
    let { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).send({
        errors: [
          {
            msg: " Start and End Dates are Required!",
          },
        ],
      });
    }

    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    const clickcount = await countleadactivity({
      date: { $gte: start, $lte: end },
      user: req.user.id,
    });

    if (!clickcount && clickcount !== 0) {
      console.log("no click count");
      return res.status(400).send({
        errors: [
          {
            msg: " Error fetching details",
          },
        ],
      });
    }

    console.log(clickcount);

    res.send({ msg: clickcount });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      errors: [
        {
          msg: " Server Error Occured, Please try again later",
        },
      ],
    });
  }
}
async function clickcounthandleradmin(req, res) {
  try {
    let { start, end } = req.query;

    // console.log("hit hereeeeeeeeeeeee");

    if (!start || !end) {
      return errorreturn(res, 401, "end and start dates are required");
    }

    // const user = await findoneuser({_id: req.user.id})
    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    let queryobj = {
      date: { $gte: start, $lte: end },
      servername: req.servername,
      converter: req.query.converter ? true : undefined,
    };
    const clickcount = await countleadactivity(
      JSON.parse(JSON.stringify(queryobj))
    );

    if (!clickcount && clickcount !== 0) {
      console.log("no click count");
      return res.status(400).send({
        errors: [
          {
            msg: " Error fetching details",
          },
        ],
      });
    }

    console.log(clickcount);

    res.send({ msg: clickcount });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      errors: [
        {
          msg: " Server Error Occured, Please try again later",
        },
      ],
    });
  }
}

async function usercountadmin(req, res) {
  try {
    let { start, end } = req.query;

    console.log("hit hereeeeeeeeeeeee");

    if (!start || !end) {
      return res.status(400).send({
        errors: [
          {
            msg: " Start and End Dates are Required!",
          },
        ],
      });
    }

    // const user = await findoneuser({_id: req.user.id})
    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    console.log(req.servername, 420);
    let queryobj = {
      premium: req.query.activesubscriber ? true : undefined,

      // date: { $gte: start, $lte: end },
      servername: req.servername,
      admin: { $ne: true },
    };
    const usercount = await countuserdocuments(
      JSON.parse(JSON.stringify(queryobj))
    );

    console.log(usercount, "user count");
    if (!usercount && usercount !== 0) {
      console.log("no click count");
      return res.status(400).send({
        errors: [
          {
            msg: " Error fetching details",
          },
        ],
      });
    }

    console.log(usercount);

    res.send({ msg: usercount });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      errors: [
        {
          msg: " Server Error Occured, Please try again later",
        },
      ],
    });
  }
}

async function countcampaignshandler(req, res) {
  try {
    let { start, end } = req.query;
    if (!start || !end) {
      return errorreturn(res, 401, "start and end dates are required");
    }

    // const user = await findoneuser({_id: req.user.id})
    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    const campaigncount = await countcampaigns({
      date: { $gte: start, $lte: end },
      servername: req.servername,
    });

    if (!campaigncount && campaigncount !== 0) {
      return errorreturn(res, 401, "Error fetching details");
    }

    res.send({ msg: campaigncount });
  } catch (error) {
    console.log(error);

    return errorreturn(
      res,
      500,
      " Server Error Occured, Please try again later"
    );
  }
}

async function countmessagesfromcampaigns(req, res) {
  try {
    let { start, end } = req.query;
    if (!start || !end) {
      return errorreturn(res, 401, "start and end dates are required");
    }

    // const user = await findoneuser({_id: req.user.id})
    start = parseInt(start); // convert strings to Number
    end = parseInt(end); // convert strings to Number

    // aggregate lead activity
    const campaigns = await findcampaigns({
      date: { $gte: start, $lte: end },
      servername: req.servername,
    });

    if (!campaigns) {
      return errorreturn(res, 401, "Error fetching some details");
    }

    let totalmessages = 0;
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];

      totalmessages += campaign.totalsent || 0;
    }

    res.send({ msg: totalmessages });
  } catch (error) {
    console.log(error);

    return errorreturn(
      res,
      500,
      " Server Error Occured, Please try again later"
    );
  }
}

module.exports = {
  clickerhandler,
  conversionhandler,
  conversionamounthandler,
  conversioncounthandler,
  clickcounthandler,
  usercountadmin,
  clickcounthandleradmin,
  countmessagesfromcampaigns,

  countcampaignshandler,
};

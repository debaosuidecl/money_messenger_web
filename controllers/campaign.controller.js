const {
  findcampaigns,
  bulkfindmodels,
  createcampaign,
  findCampaign,
  deletecampaign,
  findAndUpdatecampaign,
} = require("../services/campaign.service");
const escapeRegex = require("../utils/escapeRegex");
const LIMIT = 30;
const { validationResult } = require("express-validator");
const { findoneuser } = require("../services/user.service");
const { errorreturn } = require("../utils/returnerrorschema");
//@ts-ignore
const socket1 = require("socket.io-client")(
  "http://localhost:" + process.env.campaignserver1
);
async function findcampaignshandler(req, res) {
  const { page = 0 } = req.query;
  try {
    const campaigns = await findcampaigns(
      {
        user: req.user.id,
        $or: [
          {
            status: "scheduled",
          },
          {
            status: "sending",
          },
          {
            status: "processing",
          },
          {
            status: "done",
          },
          {
            status: "aborted",
          },
          {
            status: "paused",
          },
        ],
      },
      LIMIT,
      page
    );
    // console.log(campaigns);
    res.json(campaigns);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}
async function fuzzysearchhandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const foundcampaigns = await findcampaigns(
      {
        user: req.user.id,
        name: regex,
      },
      LIMIT,
      req.query.page
    );

    res.send(foundcampaigns);
    console.log(foundcampaigns, 49);
  } else {
    const foundcampaigns = await findcampaigns(
      {
        user: req.user.id,
      },
      LIMIT,
      req.query.page
    );

    res.send(foundcampaigns);
    console.log(foundcampaigns, 49);
  }
}
async function createcampaignhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // const { page = 1, limit = 30 } = req.query;

    const { domaingroup, leadgroup, messageschema, route } = req.body;

    const myres = await bulkfindmodels(
      domaingroup,
      leadgroup,
      messageschema,
      route,
      req.user.id
    );
    // console.log(myres, 91);
    if (!myres) {
      return res.status(400).json({ errors: [{ msg: `Entry was invalid` }] });
    }

    // @ts-ignore
    const [domaingroupdoc, leadgroupdoc, messageschemadoc, routedoc] = myres;

    console.log(
      domaingroupdoc,
      leadgroupdoc,
      messageschemadoc,
      routedoc,
      messageschema,

      177
    );

    // if(dateofschedule){

    // }

    const userforserver = await findoneuser({ _id: req.user.id });

    const newcampaign = await createcampaign({
      leadgroup,
      domaingroup,
      //@ts-ignore
      dataowner: domaingroupdoc.dataowner,
      ischeduled: req.body.ischeduled,
      //@ts-ignore

      vertical: domaingroupdoc.traffic,
      name: req.body.name,
      user: req.user.id,
      smsroute: route,
      servername: userforserver.servername,
      dateofschedule: req.body.dateofschedule,
      messageschema,
    });

    res.json(newcampaign);
    // const cm = await CampaignManager.findOne({});
    // console.log(cm);

    // if (cm.currentIndex === 1 && !req.body.ischeduled) {
    //   console.log("starting campaign now at cserver1");
    socket1.emit("send", newcampaign);
    // } else if (cm.currentIndex === 2 && !req.body.ischeduled) {
    //   console.log("starting campaign now at cserver2");
    //   socket1.emit("send", newcampaign);
    // } else if (cm.currentIndex === 3 && !req.body.ischeduled) {
    //   socket1.emit("send", newcampaign);
    //   console.log("starting campaign now at cserver3");
    // }

    // if (cm.currentindex < 3) {
    //   cm.currentindex = cm.currentindex + 1;
    // } else {
    //   cm.currentindex = 1;
    // }

    // newcampaign.handlingserver = cm.currentindex;

    // await newcampaign.save();

    // await cm.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
}

async function deletecampaignhandler(req, res) {
  try {
    const campaignfound = await findCampaign({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!campaignfound) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Campaign Doesn't exist",
          },
        ],
      });
    }

    const campaigndelete = await deletecampaign({
      _id: req.params.id,
      user: req.user.id,
    });

    console.log(campaigndelete, "campaign delete data");

    res.json(campaigndelete);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          msg: "An error occured. try again later please",
        },
      ],
    });
  }
}

async function abortcampaignhandler(req, res) {
  try {
    const { id } = req.params;
    const campaign = await findAndUpdatecampaign(
      { _id: id },
      {
        status: "aborted",
      },
      "set"
    );
    console.log(campaign, 223);

    if (!campaign) {
      return errorreturn(res, 401, "Failed to update campaign");
    }

    res.send(campaign);
  } catch (error) {
    return errorreturn(res, 500, "Could not abort campaign");
  }
}
async function pausecampaignhandler(req, res) {
  try {
    const { id } = req.params;
    const campaign = await findAndUpdatecampaign(
      { _id: id },
      {
        status: "paused",
      },
      "set"
    );

    if (!campaign) {
      return errorreturn(res, 401, "Failed to pause campaign");
    }

    res.send(campaign);
  } catch (error) {
    return errorreturn(res, 500, "Could not pause campaign");
  }
}
async function resumecampaignhandler(req, res) {
  try {
    const { id } = req.params;
    const campaign = await findAndUpdatecampaign(
      { _id: id },
      {
        status: "sending",
      },
      "set"
    );

    if (!campaign) {
      return errorreturn(res, 401, "Failed to update campaign");
    }

    socket1.emit("send", campaign);

    res.send(campaign);
  } catch (error) {
    return errorreturn(res, 500, "Could not resume campaign");
  }
}

module.exports = {
  findcampaignshandler,
  fuzzysearchhandler,
  createcampaignhandler,
  deletecampaignhandler,
  abortcampaignhandler,
  pausecampaignhandler,
  resumecampaignhandler,
};

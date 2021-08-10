//@ts-nocheck
const parseCSV = require("../helperfunctions/parseCSV");
const LeadGroup = require("../models/LeadGroup");
const Campaigns = require("../models/Campaigns");
const Dataowner = require("../models/Dataowner");
const Verticals = require("../models/Verticals");
const DomainGroup = require("../models/DomainGroup");
const Domain = require("../models/Domain");
const Leads = require("../models/Leads");
const mongoose = require("mongoose");
const SMSRoute = require("../models/SMSRoute");
const MessageSchema = require("../models/MessageSchema");
const SendingPhones = require("../models/SendingPhones");
const LeadsTotal = require("../models/LeadUndeduped");

const connectDB = require("../config/db");

// const Leads = require("../models/Leads");
const split = require("../helperfunctions/split");
const {
  refinemessage,
  randomizefoundpipes,
} = require("../helperfunctions/refinemessageschema");
const { bulkSend } = require("../helperfunctions/SMSSend");
const delay = require("../helperfunctions/delay");

function getModelBulkData(Model, limit = 1000, page = 0, query, staticskip) {
  return new Promise(async (resolve, reject) => {
    let res;
    if (!staticskip) {
      res = await Model.find(query)
        .limit(limit)
        .skip(limit * page)
        .lean();
    } else {
      res = await Model.find(query).limit(limit).skip(staticskip).lean();
    }

    resolve(res);
  });
}

(async () => {
  await connectDB();
  const mycampaigndetailsfromsocket = {
    _id: "60ce51b926cf4fc510039f2c",
    totalsent: 0,
    status: "scheduled",
    leadgroup: "60bb8bd6808f6e512c358c8f",
    domaingroup: "60cdf1e6ca135cf7385e2e3a",
    dataowner: "60a85af8f9f12d037d2776aa",
    vertical: "60a3138934f0fbb420d7210f",
    name: "We Buy Campaign",
    user: "5e32c64cdd69d2999c5fff15",
    smsroute: "60c23908d737e93b5c803828",
    // date: { $date: { $numberLong: "1624134073504" } },
    // __v: { $numberInt: "0" },
  };
  // ProcessGroup(leadGroup._id);

  // const update = await Campaigns.updateMany(
  //   {},
  //   {
  //     $set: {
  //       failedsends: 0,
  //     },
  //   },
  //   {
  //     new: true,
  //   }
  // );

  // console.log(update);
  // sendcampaigns(mycampaigndetailsfromsocket);
})();

function sendcampaigns(campaigndetails, io) {
  return new Promise(async (resolve, reject) => {
    try {
      const campaign = await Campaigns.findOne({
        _id: campaigndetails._id,

        $or: [
          {
            status: "scheduled",
          },
          {
            status: "processing",
          },
          {
            status: "done",
          },
        ],
      }).populate(
        "leadgroup domaingroup smsroute dataowner vertical messageschema"
      );
      // .lean();

      console.log(campaign, "campaign");
      //   return;]

      //   return;

      const {
        startpossendingphone,
        startposleadphone,
        domaingroup,
        leadgroup,
        user,
        smsroute,
        messageschema,
      } = campaign;
      const speed = smsroute.defaultsentspeed || 100;

      const numberOfLeadsPerRun = speed * 60;

      const sendphonecount = smsroute.numberofsources;
      const rotationnumber = domaingroup.rotationnumber;

      // if the send phone count is less than the number of leads per run, repeat it up until it hits the number of leads per run and note the number you added and where you stopped with %

      // else if sendphone count is more than leads per run, set

      console.log(leadgroup._id, 90);

      // get sendingphone number count

      console.time("prelimdata");

      let [leads, sourcephones] = await Promise.all([
        // leads
        getModelBulkData(LeadsTotal, numberOfLeadsPerRun, startposleadphone, {
          leadgroup: leadgroup._id,
        }),

        // sendingphones
        getModelBulkData(
          SendingPhones,
          numberOfLeadsPerRun,
          null,
          {
            route: mongoose.Types.ObjectId(smsroute._id),
          },
          startpossendingphone || 0
        ),
      ]);

      console.log(sourcephones.length, leads.length, 132);

      console.timeEnd("prelimdata");

      if (leads.length <= 0) {
        console.log("there are no more leads, ending campaign");
        campaign.status = "done";

        await campaign.save();
        return;
        resolve("done");
      }

      if (sourcephones.length < numberOfLeadsPerRun) {
        if (startpossendingphone + sourcephones.length === sendphonecount) {
          // if we are at the end of the phone cycle
          console.log("every thing right here with a less source phone");
          let additiontosourchphone = [];
          console.log(startpossendingphone, "startpostlead");
          if (startpossendingphone !== 0) {
            console.log(startpossendingphone, "is not zero");
            additiontosourchphone = await getModelBulkData(
              SendingPhones,
              numberOfLeadsPerRun - sourcephones.length,
              null,
              {
                route: smsroute._id,
              },
              0 // skip nothing and start from the beginning until you get the results to equalize
            );

            campaign.startpossendingphone = 0;
            await campaign.save();
            console.log("Saving startpostsendingphone as zero");
          }

          sourcephones = [...sourcephones, ...additiontosourchphone];

          console.log("new sourcephones", sourcephones.length, sourcephones[2]);
        } else {
          console.log("there may be a problem", sourcephones.length);
        }
      } else {
        console.log(
          "length is equal or enough",
          sourcephones.length,
          numberOfLeadsPerRun
        );
      }

      // get domains
      const domains = await Domain.find({
        domaingroup,
      }).lean();

      //   console.log(domains, 108);
      console.time("domainprocess");

      let domainArray = [];
      let trimeddomainlist = [];
      for (let i = 0; i < domains.length; i++) {
        for (let j = 0; j < rotationnumber; j++) {
          domainArray.push(domains[i]);
        }
      }

      let lastdomain = domains[domains.length - 1];
      let additionallength = leadgroup.totalProcessed - domainArray.length;
      for (let i = 0; i < additionallength; i++) {
        domainArray.push(lastdomain);
      }

      trimeddomainlist = domainArray.slice(
        startposleadphone,
        startposleadphone + numberOfLeadsPerRun
      );

      console.timeEnd("domainprocess");

      console.log(domainArray.length, "domain array");
      console.log(leadgroup.totalProcessed, "total processed");

      console.log(trimeddomainlist.length, 225);

      let messageinit = await refinemessage(
        messageschema.messagestructure,
        user
      );
      //   return;

      console.log(messageinit, "message init");
      //   return;
      let smsobject = [];

      console.time("formatting array");
      for (let i = 0; i < leads.length; i++) {
        let lead = leads[i];
        let fromphone = sourcephones[i % sourcephones.length];

        let message = randomizefoundpipes(
          messageinit,
          lead,
          trimeddomainlist[i].name
        );

        smsobject.push({
          lead,
          fromphone,
          message,
        });
      }

      console.timeEnd("formatting array");

      // time to format the SMS ROUTE AXIOS SENDER

      console.log(smsobject[0]);

      console.time("split");
      let smsobjectsplit = split(smsobject, speed);

      console.timeEnd("split");

      console.time("sending bulk");
      for (let i = 0; i < smsobjectsplit.length; i++) {
        try {
          const axiosarray = await bulkSend(smsobjectsplit[i], smsroute);
        } catch (error) {
          console.log(error);
        }
        await delay(200);
      }

      console.timeEnd("sending bulk");

      console.time("saving campaign status");

      campaign.startposleadphone += 1;

      campaign.totalsent += leads.length;

      campaign.startpossendingphone += sourcephones.length;

      const c = await campaign.save();

      console.timeEnd("saving campaign status");
      //   console.log(c, 281);
      console.log("campaign saved");

      console.log("running campaign next batch");
      const finalresult = await sendcampaigns(campaigndetails, io);
      resolve(finalresult);
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = sendcampaigns;

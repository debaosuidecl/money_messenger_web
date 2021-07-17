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

var srs = require("secure-random-string");

const connectDB = require("../config/db");

// const Leads = require("../models/Leads");
const split = require("./split");
const { refinemessage, randomizefoundpipes } = require("./refinemessageschema");
const { bulkSend } = require("./SMSSend");
const delay = require("./delay");
const bulksetintomap = require("../redisfunctions/bulksetintomap");

function getModelBulkData(
  Model,
  limit = 1000,
  page = 0,
  query,
  staticskip,
  stepskip = 2000
) {
  return new Promise(async (resolve, reject) => {
    console.log(limit, 30);
    let res;
    if (!staticskip && staticskip != 0) {
      console.log(limit, 31);

      res = await Model.find(query)
        .limit(limit)
        .skip(limit * page)
        .lean();
    } else {
      // console.log(limit, 32);

      res = await Model.find(query).limit(limit).skip(staticskip).lean();
      // }
    }

    resolve(res);
  });
}

function sendcampaigns(campaigndetails, io, redis) {
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
          {
            status: "sending",
          },
          {
            status: "paused",
          },
        ],
      }).populate(
        "leadgroup domaingroup smsroute dataowner vertical messageschema"
      );
      // .lean();

      try {
        // set status to sending if it's not sending
        if (campaign.status != "sending") {
          campaign.status = "sending";

          await campaign.save();

          io.sockets.emit("status", campaign);
        }
      } catch (error) {
        console.log(error, 71);
      }

      console.log(campaign, "campaign");

      const {
        startpossendingphone,
        startposleadphone,
        domaingroup,
        leadgroup,
        user,
        smsroute,
        messageschema,
      } = campaign;
      const speed = smsroute.defaultsendspeed || 100;

      const numberOfLeadsPerRun = speed * 60;

      const sendphonecount = smsroute.numberofsources;

      if (sendphonecount <= 0) {
        const update = await Campaign.findOneAndUpdate(
          {
            _id: campaigndetails._id,
          },
          {
            $set: {
              error: "There are no source phone numbers for this route",
              status: "aborted",
            },
          },
          {
            new: true,
          }
        );
        io.sockets.emit("status", update);
        return;
      }
      const rotationnumber = domaingroup.rotationnumber;

      console.log(leadgroup._id, 90);

      // get sendingphone number count

      console.time("prelimdata");
      console.log(startposleadphone, 139);
      // return;

      let [leads, sourcephones] = await Promise.all([
        // leads
        getModelBulkData(
          LeadsTotal,
          numberOfLeadsPerRun,
          null,
          {
            leadgroup: leadgroup._id,
          },
          startposleadphone,
          5000
          // {
          //   // usesplitter:
          // }
        ),

        // sendingphones
        getModelBulkData(
          SendingPhones,
          numberOfLeadsPerRun,
          null,
          {
            route: mongoose.Types.ObjectId(smsroute._id),
          },
          startpossendingphone || 0,
          5000
        ),
      ]);

      console.log(sourcephones.length, leads.length, 132);

      console.timeEnd("prelimdata");

      // return;

      if (leads.length <= 0) {
        console.log("there are no more leads, ending campaign");
        campaign.status = "done";

        await campaign.save();
        io.sockets.emit("status", campaign);

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
      const campaignshortidmap = [];
      for (let i = 0; i < leads.length; i++) {
        const shortid = srs({ length: 10 });
        let lead = leads[i];
        let fromphone = sourcephones[i % sourcephones.length];

        campaignshortidmap.push(shortid);
        campaignshortidmap.push(
          JSON.stringify({
            leadid: lead._id,
            campaignid: campaign._id,
          })
        );

        let message = randomizefoundpipes(
          messageinit,
          lead,
          trimeddomainlist[i].name,
          shortid
        );

        smsobject.push({
          lead,
          fromphone,
          message,
        });
      }

      console.timeEnd("formatting array");

      console.log(campaignshortidmap, "256");
      // return;
      console.time("save short id to redis");

      try {
        await bulksetintomap("short_id_map", campaignshortidmap, redis);
      } catch (error) {
        console.log(error);
      }

      console.timeEnd("save short id to redis");

      // time to format the SMS ROUTE AXIOS SENDER

      console.log(smsobject[0]);

      console.time("split");
      let smsobjectsplit = split(smsobject, speed);

      console.timeEnd("split");

      console.time("sending bulk");
      for (let i = 0; i < smsobjectsplit.length; i++) {
        //
        try {
          const axiosarray = await bulkSend(smsobjectsplit[i], smsroute);

          // const
        } catch (error) {
          console.log(error);
        }

        // campaign.totalsent += smsobjectsplit[i].length;

        try {
          // await campaign.save();
          let campaignvalue = await Campaigns.findOneAndUpdate(
            {
              _id: campaign._id,
            },
            {
              $inc: {
                totalsent: smsobjectsplit[i].length,
              },
            },
            {
              new: true,
            }
          ).populate(
            "leadgroup domaingroup smsroute dataowner vertical messageschema"
          );

          if (!campaignvalue) {
            return console.log("deleted", campaign, "delete");
            // io.sockets.emit("status", );
          }

          if (campaignvalue.status !== "sending") {
            // return console.log("aborted", campaign, "abort");

            const update = await Campaigns.findOneAndUpdate(
              {
                _id: campaigndetails._id,
              },
              {
                $set: {
                  error: "Paused",
                  status: campaignvalue.status,
                  startposleadphone: campaignvalue.totalsent,
                },
              },
              {
                new: true,
              }
            );
            io.sockets.emit("status", update);

            return;
          }
          io.sockets.emit("status", campaignvalue);
        } catch (error) {
          console.log(error, 268);
          io.sockets.emit("status", campaign);
        }
        await delay(200);
      }

      console.timeEnd("sending bulk");

      console.time("saving campaign status");

      // campaign.startposleadphone += 1;
      campaign.startposleadphone += leads.length;

      // campaign.totalsent += leads.length;

      let campaignvalue = await Campaigns.findOneAndUpdate(
        {
          _id: campaign._id,
        },
        {
          $inc: {
            startposleadphone: leads.length,
            startpossendingphone: sourcephones.length,
          },
        },
        {
          new: true,
        }
      ).populate(
        "leadgroup domaingroup smsroute dataowner vertical messageschema"
      );

      // campaign.startpossendingphone += sourcephones.length;

      // const c = await campaign.save();

      io.sockets.emit("status", campaignvalue);

      console.timeEnd("saving campaign status");
      //   console.log(c, 281);
      console.log("campaign saved");

      console.log("running campaign next batch");
      const finalresult = await sendcampaigns(campaigndetails, io, redis);
      resolve(finalresult);
    } catch (error) {
      console.log(error);

      const update = await Campaigns.findOneAndUpdate(
        {
          _id: campaigndetails._id,
        },
        {
          $set: {
            error: "An Error Occured",
            status: "aborted",
          },
        },
        {
          new: true,
        }
      );
      io.sockets.emit("status", update);
    }
  });
}

module.exports = sendcampaigns;

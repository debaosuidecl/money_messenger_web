const Campaign = require("../models/Campaigns");

async function campaignsender(io) {
  // console.log("running a task every second");
  // running = true;
  // const sendingphonegroupschedule = await SendingPhoneGroup.find({
  //   status: "scheduled",
  // }).limit(10);

  // const result = await Promise.allSettled(
  //   sendingphonegroupschedule.map((group) => ProcessGroup(group))
  // );
  // console.log(result, 46);

  const campaignscheduled = await Campaign.find();

  console.log("running");
}

module.exports = campaignsender;

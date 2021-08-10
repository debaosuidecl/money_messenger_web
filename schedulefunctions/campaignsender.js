const Campaign = require("../models/Campaigns");

async function campaignsender(campaigndetails,io, redis) {
  // console.log("running a task every second");
  // running = true;
  // const sendingphonegroupschedule = await SendingPhoneGroup.find({
  //   status: "scheduled",
  // }).limit(10);

  // const result = await Promise.allSettled(
  //   sendingphonegroupschedule.map((group) => ProcessGroup(group))
  // );
  // console.log(result, 46);

  const campaignscheduled = await Campaign.findOne({
    _id: campaigndetails._id, 
    status: "scheduled", 
    ischeduled: true
  });
  console.log(campaignscheduled, 'campaign found')
  if(!campaignscheduled){
    return "stop";
  }

  if(!campaignscheduled.numericdate){
    console.log("no numeric date")

    return "stop"
  }


  if(isNaN(campaignscheduled.numericdate)){
      console.log("numeric date is not a number")

      return false
  }

  if(new Date().getTime() < campaignscheduled.numericdate){
    console.log("it's not time", campaigndetails)
    return false
  } 



  if(new Date().getTime() >= campaignscheduled.numericdate){
    console.log("it's time", campaigndetails)
    return true
  } 

  return false




  console.log("running");
}

module.exports = campaignsender;

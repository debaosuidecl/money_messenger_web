const connectDB = require("../config/db");
const Campaigns = require("../models/Campaigns");
const User = require("../models/User");
(async () => {
  await connectDB();

  const campaign = await Campaigns.find({
    _id: "60d9dd27b2f4b84394041960",
    servername: "oosuide",
  }).populate("user");

  console.log(campaign, 12);
})();

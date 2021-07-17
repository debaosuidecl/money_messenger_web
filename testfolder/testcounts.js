// @ts-nocheck
const connectDB = require("../config/db");
const parseCSV = require("../helperfunctions/parseCSV");
const LeadGroup = require("../models/LeadGroup");
const LeadActivity = require("../models/leadactivity.model");
const Leads = require("../models/Leads");
const Blacklist = require("../models/blacklist.model");
const path = require("path");
const split = require("../helperfunctions/split");
const fs = require("fs");
var srs = require("secure-random-string");

const uuid = require("uuid");
const LeadsTotal = require("../models/LeadUndeduped");

const leadGroup = {
  headerMaps: {
    phone: "phone",
    firstname: "first_name",
    lastname: "",
    address: "",
    city: "",
    state: "",
  },
  handlingServer: 1,
  status: "scheduled",
  headers: ["first_name", "phone"],
  uploadCount: 0,
  infileduplicates: 0,
  globalduplicates: 0,
  _id: "60bb80a226d05647408cb668",
  user: "5e32c64cdd69d2999c5fff15",
  friendlyname: "thinkable-rain-9868",
  name: "lead-uploads/b83669e5-3262-4a76-bc3f-69c56d61d948-pre_scrub_3.csv",
  date: "2021-06-03T14:44:13.407Z",
  __v: 0,
};
// const request = {
//   orderData: {
//     totalPrice: 0,
//     totalTaxes: 0,
//     items: [
//       {
//         quantity: 1,
//         id: "770fa6cf-9b8f-4a73-9d3f-97523b179c29",
//         image:
//           "https://s3.amazonaws.com/toasttab/restaurants/restaurant-74867000000000000/menu/items/4/item-200000012047377914_1623095953.jpg",
//         itemPrice: "9.95",
//         modifiers: [],
//         name: "Turmeric Cauliflower & Kale Salad",
//         options: {
//           id: "770fa6cf-9b8f-4a73-9d3f-97523b179c29",
//           name: "Turmeric Cauliflower & Kale Salad",
//           price: 9.95,
//         },
//         specialInstructions: "",
//         price: 9.95,
//         guestName: "",
//       },
//     ],
//     pendingItem: {},
//   },
//   last_seen_at: 1625587235065,
//   scheduleDateTime: "2021-07-07T11:00:00.000Z",
//   is_delivery: true,
//   abxNotify1: false,
//   abxNotifyTime1: "2021-07-06 04:01:35",
//   abxNotify2: false,
//   abxNotifyTime2: "2021-07-06 04:03:35",
//   abxNotify3: false,
//   abxNotifyTime3: "2021-07-06 04:05:35",
//   promo: false,
// };
(async () => {
  await connectDB();
  //   ProcessGroup(leadGroup._id);
  getcounts(leadGroup);
})();

async function getcounts() {
  try {
    // console.time("startfetch");
    // const res = await Leads.countDocuments({
    //   leadgroup: "60bb80a226d05647408cb668",
    // });
    // console.timeEnd("startfetch");
    // console.log(res, 71);

    // console.log(res);

    console.log("fetching");
    console.time("startfetch");

    // const res = await Blacklist.aggregate([
    //   //   { $match: { user: "5e32c64cdd69d2999c5fff15" } },
    //   // { $match: { time: {$gte: 20, $lte: 40} } },
    //   { $group: { _id: null, phone: { $sum: "$phone" } } },
    // ]);
    const res = await LeadActivity.aggregate([
      {
        $match: {
          user: "5e32c64cdd69d2999c5fff15",
          converter: true,
          payout: { $ne: 0 },
        },
      },
      // { $match: { time: {$gte: 20, $lte: 40} } },
      { $group: { _id: null, payout: { $sum: "$payout" } } },
    ]);
    console.timeEnd("startfetch");

    console.log(res, 96);
  } catch (error) {
    console.log(error);
  }
}

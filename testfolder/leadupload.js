// @ts-nocheck
const connectDB = require("../config/db");
const parseCSV = require("../helperfunctions/parseCSV");
const LeadGroup = require("../models/LeadGroup");
const Leads = require("../models/Leads");
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
// // const leadGroup = {
// //   headerMaps: {
// //     phone: "phone",
// //     firstname: "",
// //     lastname: "",
// //     address: "",
// //     city: "",
// //     state: "",
// //   },
// //   handlingServer: 1,
// //   status: "scheduled",
// //   headers: ["phone"],
// //   uploadCount: 0,
// //   infileduplicates: 0,
// //   globalduplicates: 0,
// //   _id: "60b937fa8fc82d0ab03b4f75",
// //   user: "5e32c64cdd69d2999c5fff15",
// //   friendlyname: "honest-knee-3075",
// //   name: "lead-uploads/3b106ec1-a674-4423-b535-ad565ebab1dd-pre_scrub_4.csv",
// //   originalname: "pre_scrub_4.csv",
// //   date: "2021-06-03T20:13:46.685Z",
// //   __v: 0,
// // };

(async () => {
  await connectDB();
  ProcessGroup(leadGroup._id);
})();

function ProcessGroup(_id) {
  return new Promise(async (resolve, reject) => {
    try {
      let csvparsed = [];

      const group = await LeadGroup.findById(_id);

      group.status = "processing";
      await group.save();
      const editable = path.resolve(
        __dirname,
        "..",
        group.name + uuid.v4() + ".csv"
      );
      console.log(editable);
      fs.writeFileSync(
        editable,
        "phone,firstname,lastname,address,city,state\n"
      );
      // return;

      try {
        csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name));
        console.log(csvparsed);
      } catch (error) {
        console.log(error);
      }

      const headers = csvparsed[0];

      const phoneheaderindex = headers.indexOf(group.headerMaps.phone);
      const firstnameheaderindex = headers.indexOf(group.headerMaps.firstname);
      const lastnameheaderindex = headers.indexOf(group.headerMaps.lastname);
      const addressheaderindex = headers.indexOf(group.headerMaps.address);
      const cityheaderindex = headers.indexOf(group.headerMaps.city);
      const stateheaderindex = headers.indexOf(group.headerMaps.state);
      if (phoneheaderindex == -1) {
        await LeadGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              error: "Header improperly matched.  Please try again.",
            },
          }
        );
        resolve("error");
      }

      csvparsed.shift();

      const phones = {};

      let infiledupes = 0;

      let totalUploadCount = csvparsed.length;
      csvparsed = csvparsed
        .map((item) => {
          return JSON.parse(
            JSON.stringify({
              shortid: srs({ length: 10 }),
              phone:
                phoneheaderindex === -1 ? undefined : item[phoneheaderindex],
              firstname:
                firstnameheaderindex === -1
                  ? undefined
                  : item[firstnameheaderindex],
              lastname:
                lastnameheaderindex === -1
                  ? undefined
                  : item[lastnameheaderindex],
              address:
                addressheaderindex === -1
                  ? undefined
                  : item[addressheaderindex],
              city: cityheaderindex === -1 ? undefined : item[cityheaderindex],
              state:
                stateheaderindex === -1 ? undefined : item[stateheaderindex],

              leadgroup: group._id,
              user: group.user,
            })
          );
        })
        .filter((item) => {
          let isExisting = phones.hasOwnProperty(`${item["phone"]}`);
          if (isExisting) {
            infiledupes++;
          }
          return isExisting ? false : (phones[`${item["phone"]}`] = 1);
        });

      let duplicates = 0;
      console.log(csvparsed);

      let csvtosave = [...csvparsed];

      const updatevalue = await LeadGroup.findOneAndUpdate(
        {
          _id: group._id,
        },
        {
          $set: {
            uploadCount: totalUploadCount,
            infileduplicates: infiledupes,
          },
        },
        {
          new: true,
        }
      );

      console.log(updatevalue, "update");

      let splitdata = split(csvparsed, 10000);

      for (let i = 0; i < splitdata.length; i++) {
        console.time("adding records");

        try {
          const result = await Leads.collection.insertMany(splitdata[i], {
            ordered: false,
          });
          console.log(i);
        } catch (error) {
          if (error.writeErrors) {
            console.log(error.writeErrors.length, 131);
            if (error.writeErrors && error.writeErrors.length > 0) {
              error.writeErrors.forEach((e) => {
                if (e.code === 11000) {
                  duplicates++;
                }
              });
            }
          }
        }

        // for (let j = 0; j < splitdata[i].length; j++) {
        //   const record = splitdata[i][j];
        //   fs.appendFileSync(
        //     editable,
        //     `"${record.phone}","${record.firstname || ""}","${
        //       record.lastname || ""
        //     }","${record.address || ""}","${record.city || ""}","${
        //       record.state || ""
        //     }"\n`
        //   );
        // }

        try {
          const result = await LeadsTotal.collection.insertMany(splitdata[i], {
            ordered: false,
          });
          console.log(i);
        } catch (error) {
          console.log(error, 163);
        }
        console.timeEnd("adding records");
      }

      console.log(duplicates, "duplicates");

      await LeadGroup.findOneAndUpdate(
        {
          _id: group.id,
        },
        {
          $set: {
            status: "done",
            dedupedlocation: editable.split("lead-uploads")[1].slice(1),

            // uploadCount: csvparsed.length,

            globalduplicates: duplicates,
            // infileduplicates: totalInFileDuplicates,
          },
        }
      );

      resolve(csvparsed);

      // for(let i=0; i < csvparsed.length; i++){

      // }

      // console.log(csvparsed, 56);
    } catch (error) {
      console.log(error);
    }
  });
}

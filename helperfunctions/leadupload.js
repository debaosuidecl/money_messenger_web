//@ts-nocheck
const parseCSV = require("../helperfunctions/parseCSV");
const LeadGroup = require("../models/LeadGroup");
const Leads = require("../models/Leads");
const path = require("path");
const split = require("../helperfunctions/split");
const LeadsTotal = require("../models/LeadUndeduped");
const fs = require("fs");
var srs = require("secure-random-string");
const uuid = require("uuid");

function leadupload(_id, io) {
  return new Promise(async (resolve, reject) => {
    try {
      let csvparsed = [];

      const group = await LeadGroup.findById(_id);

      group.status = "processing";
      await group.save();

      // return;

      try {
        // csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name)); // replace this part

        csvparsed = await parseCSV(group.cloudinaryurl, ",", {
          remote: true,
        });
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
              // shortid: srs({ length: 10 }),

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

      // let csvtosave = [...csvparsed];

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

      io.sockets.emit("updatescrub", updatevalue);

      let splitdata = split(csvparsed, 10000);

      for (let i = 0; i < splitdata.length; i++) {
        console.time("adding records");
        try {
          const result = await Leads.collection.insertMany(splitdata[i], {
            ordered: false,
          });
          console.log(i);
        } catch (error) {
          console.log(error.writeErrors.length, 131);
          if (error.writeErrors && error.writeErrors.length > 0) {
            error.writeErrors.forEach((e) => {
              if (e.code === 11000) {
                duplicates++;
              }
            });
          }
        }

        try {
          const result = await LeadsTotal.collection.insertMany(splitdata[i], {
            ordered: false,
          });
          console.log(i);
        } catch (error) {
          console.log(error, 163);
        }
        const updatevalue = await LeadGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $inc: {
              totalProcessed: splitdata[i].length,
            },
          },
          {
            new: true,
          }
        );

        io.sockets.emit("updatescrub", updatevalue);
        console.timeEnd("adding records");
      }

      console.log(duplicates, "duplicates");

      const finalupdate = await LeadGroup.findOneAndUpdate(
        {
          _id: group.id,
        },
        {
          $set: {
            status: "done",

            // uploadCount: csvparsed.length,

            globalduplicates: duplicates,
            // infileduplicates: totalInFileDuplicates,
          },
        }
      );

      io.sockets.emit("updatescrub", finalupdate);

      //     let finalupdate = await LeadGroup.findOneAndUpdate(
      //       {
      //         _id: group.id,
      //       },
      //       {
      //         $set: {
      //           status: "done",

      //           // uploadCount: csvparsed.length,

      //           globalduplicates: duplicates,
      //           // infileduplicates: totalInFileDuplicates,
      //         },
      //       },
      //       {
      //         new: true,
      //       }
      //     );

      //     io.sockets.emit("updatescrub", finalupdate);
      resolve(csvparsed);

      // for(let i=0; i < csvparsed.length; i++){

      // }

      // console.log(csvparsed, 56);
    } catch (error) {
      console.log(error);
    }
  });
  // return new Promise(async (resolve, reject) => {
  //   try {
  //     let csvparsed = [];

  //     const group = await LeadGroup.findById(_id);

  //     group.status = "processing";
  //     await group.save();

  //     io.sockets.emit("updatescrub", group);

  //     try {
  //       csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name));
  //       console.log(csvparsed);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     const headers = csvparsed[0];
  //     const phoneheaderindex = headers.indexOf(group.headerMaps.phone);
  //     const firstnameheaderindex = headers.indexOf(group.headerMaps.firstname);
  //     const lastnameheaderindex = headers.indexOf(group.headerMaps.lastname);
  //     const addressheaderindex = headers.indexOf(group.headerMaps.address);
  //     const cityheaderindex = headers.indexOf(group.headerMaps.city);
  //     const stateheaderindex = headers.indexOf(group.headerMaps.state);
  //     if (phoneheaderindex == -1) {
  //       await LeadGroup.findOneAndUpdate(
  //         {
  //           _id: group._id,
  //         },
  //         {
  //           $set: {
  //             status: "error",
  //             error: "Header improperly matched.  Please try again.",
  //           },
  //         }
  //       );
  //       resolve("error");
  //     }

  //     csvparsed.shift();

  //     const phones = {};

  //     let infiledupes = 0;

  //     let totalUploadCount = csvparsed.length;
  //     csvparsed = csvparsed
  //       .map((item) => {
  //         return JSON.parse(
  //           JSON.stringify({
  //             phone:
  //               phoneheaderindex === -1 ? undefined : item[phoneheaderindex],
  //             firstname:
  //               firstnameheaderindex === -1
  //                 ? undefined
  //                 : item[firstnameheaderindex],
  //             lastname:
  //               lastnameheaderindex === -1
  //                 ? undefined
  //                 : item[lastnameheaderindex],
  //             address:
  //               addressheaderindex === -1
  //                 ? undefined
  //                 : item[addressheaderindex],
  //             city: cityheaderindex === -1 ? undefined : item[cityheaderindex],
  //             state:
  //               stateheaderindex === -1 ? undefined : item[stateheaderindex],

  //             leadgroup: group._id,
  //             user: group.user,
  //           })
  //         );
  //       })
  //       .filter((item) => {
  //         let isExisting = phones.hasOwnProperty(`${item["phone"]}`);
  //         if (isExisting) {
  //           infiledupes++;
  //         }
  //         return isExisting ? false : (phones[`${item["phone"]}`] = 1);
  //       });

  //     let duplicates = 0;
  //     console.log(csvparsed);

  //     const updatevalue = await LeadGroup.findOneAndUpdate(
  //       {
  //         _id: group._id,
  //       },
  //       {
  //         $set: {
  //           uploadCount: totalUploadCount,
  //           infileduplicates: infiledupes,
  //         },
  //       },
  //       {
  //         new: true,
  //       }
  //     );

  //     console.log(updatevalue, "update");

  //     io.sockets.emit("updatescrub", updatevalue);

  //     let splitdata = split(csvparsed, 10000);

  // for (let i = 0; i < splitdata.length; i++) {
  //   try {
  //     const result = await Leads.collection.insertMany(splitdata[i], {
  //       ordered: false,
  //     });
  //     console.log(i);
  //   } catch (error) {
  //     console.log(error.writeErrors.length, 131);
  //     if (error.writeErrors && error.writeErrors.length > 0) {
  //       error.writeErrors.forEach((e) => {
  //         if (e.code === 11000) {
  //           duplicates++;
  //         }
  //       });
  //     }
  //   }

  //   const updatevalue = await LeadGroup.findOneAndUpdate(
  //     {
  //       _id: group._id,
  //     },
  //     {
  //       $inc: {
  //         totalProcessed: splitdata[i].length,
  //       },
  //     },
  //     {
  //       new: true,
  //     }
  //   );

  //   io.sockets.emit("updatescrub", updatevalue);
  // }

  //     console.log(duplicates, "duplicates");

  //     let finalupdate = await LeadGroup.findOneAndUpdate(
  //       {
  //         _id: group.id,
  //       },
  //       {
  //         $set: {
  //           status: "done",

  //           // uploadCount: csvparsed.length,

  //           globalduplicates: duplicates,
  //           // infileduplicates: totalInFileDuplicates,
  //         },
  //       },
  //       {
  //         new: true,
  //       }
  //     );

  //     io.sockets.emit("updatescrub", finalupdate);

  //     resolve(csvparsed);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
}

module.exports = leadupload;

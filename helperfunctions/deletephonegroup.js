const fs = require("fs");
const path = require("path");
const SendingPhoneGroup = require("../models/SendingPhonesGroup");

const SendingPhones = require("../models/SendingPhones");
const SMSRoute = require("../models/SMSRoute");

function DeleteGroup(group, io) {
  return new Promise(async (resolve, reject) => {
    try {
      const findItemsToDelete = await SendingPhones.find({
        route: group.route,
        sendingphonegroup: group._id.toString(),
      })
        .limit(10000)

        .lean();

      console.log(findItemsToDelete.length, 19);

      const itemdeletion = await SendingPhones.collection.deleteMany({
        _id: {
          $in: findItemsToDelete.map((item) => item._id),
        },
      });
      console.log(itemdeletion, 54);

      const itemsStillExist = await SendingPhones.findOne({
        route: group.route,
        sendingphonegroup: group._id.toString(),
      });

      console.log(itemsStillExist, 60);

      if (itemsStillExist) {
        await DeleteGroup(group);
        resolve("done");
      } else {
        const deletinggroup = await SendingPhoneGroup.findOneAndDelete({
          _id: group._id,
        });

        console.log("deleteing group", deletinggroup);
        await SMSRoute.findOneAndUpdate(
          {
            _id: group.route,
          },
          {
            $set: {
              numberofsources: 0,
            },
          }
        );

        console.log(deletinggroup, "68");

        io.sockets.emit("sourcedeletedone", deletinggroup);

        try {
          fs.unlinkSync(path.resolve(__dirname, "..", group.name)); // to be changed
        } catch (error) {
          console.log(error);
        }

        resolve("done");
      }
    } catch (error) {
      console.log("error here");
      console.log(error);
      console.log("error here");
    }
  });
}

module.exports = DeleteGroup;

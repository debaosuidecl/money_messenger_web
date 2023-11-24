const USERLB = require("../models/MoneyMessengerUser");
var FCM = require("fcm-node");

class FcmEngine {
  constructor() {
    this.serverKey =
      "AAAAy-7T7Q4:APA91bGiOqLWioy6stiHLaQXsFl5fnrgCP2_n4l3HSDDxvBWehdNBDdBbJN5cBw1FP0lqcoV2ehwlDLG76Spfv2dA7RZ6yiY_ShLkO2cvROAWMRu651aeU4I5OhCG8kaUmfwNecpkoUf";
    this.fcmInstance = new FCM(this.serverKey);
    this.onlineAllowance = 5;
    this.batchCount = 1000;
  }

  // async pingAllPhones() {
  //     const count = await USERLB.countDocuments({});
  //     for (let i = 0; i < Math.ceil(count / this.batchCount); i++) {
  //         const users = await USERLB.find({
  //             firebaseToken: {
  //                 $ne: null
  //             },
  //             verified: "yes",
  //         })
  //             .skip(i)
  //             .limit(this.batchCount)
  //             .select("firebaseToken")
  //             .lean();
  //         console.log(users)
  //         const registration_ids = users.map(user => user.firebaseToken);
  //         try {
  //             await this.send(registration_ids, { type: "PING" })
  //         } catch (error) {
  //             console.log(error)
  //         }
  //     }
  //     return true
  // }

  // async sendInfoToPhones(title, body) {
  //     const count = await USERLB.countDocuments({});
  //     for (let i = 0; i < Math.ceil(count / this.batchCount); i++) {
  //         const users = await USERLB.find({
  //             firebaseToken: {
  //                 $ne: null
  //             }
  //         })
  //             .skip(i)
  //             .limit(this.batchCount)
  //             .select("firebaseToken")
  //             .lean();
  //         console.log(users)
  //         const registration_ids = users.map(user => user.firebaseToken);
  //         try {
  //             const message = {
  //                 registration_ids,
  //                 "content_available": true,
  //                 "priority": "high",
  //                 notification: {
  //                     title: title,
  //                     body: body
  //                 },
  //                 data: {}
  //             };

  //             this.fcmInstance.send(message, function (err, response) {
  //                 if (err) {
  //                     console.log("Something has gone wrong!");
  //                     console.log(err, data, registration_ids)
  //                     // reject(err)
  //                 } else {
  //                     console.log("Successfully sent with response: ", response);
  //                     // resolve(true)
  //                 }
  //             })
  //         } catch (error) {
  //             console.log(error)
  //         }
  //     }
  //     return true
  // }

  send = async (registration_ids, data) => {
    return new Promise((resolve, reject) => {
      try {
        const message = {
          registration_ids,
          content_available: true,
          priority: "high",
          data,
        };

        this.fcmInstance.send(message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
            console.log(err, data, registration_ids);
            resolve(false);
            reject(err);
          } else {
            console.log("Successfully sent with response: ", response);

            resolve(true);
          }
        });
      } catch (error) {
        console.log(error, "item");
        return false;
      }
    });
  };
}

module.exports = FcmEngine;

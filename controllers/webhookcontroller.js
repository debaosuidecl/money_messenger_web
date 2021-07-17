const { retrievecustomer } = require("../services/customer.service");
const { stripeeventconstructor } = require("../services/subscription.service");
const { updateuser } = require("../services/user.service");
const { returnexpiry } = require("../utils/returnexpirydate");
exports.handlestripewebhooks = async (req, res) => {
  // simple deserialization
  // const event = JSON.parse(req.body);
  // console.log(event.type);
  // console.log(event.data.object);
  // console.log(event.data.object.id);

  // signature verification
  let event;
  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  const endPointSecret = "whsec_USulbIShL1xRB1rsYms9bGCFa9s91kNV";

  try {
    event = stripeeventconstructor(payload, sig, endPointSecret);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
    });
    return;
  }
  console.log(event.type);
  console.log(event.data.object);
  console.log(event.data.object.id);

  switch (event.type) {
    case "invoice.paid": {
      const customerid = event.data.object.customer;

      // get customer by customerid

      const customer = await retrievecustomer({ customerid });

      if (!customer) {
        console.log("customer not found");
        return res.sendStatus(401);
      }

      // find user to update

      const user = await updateuser(
        { _id: customer.user },
        {
          premium: true,
          sub_valid_till: returnexpiry(1, 2),
        },
        "set"
      );

      if (!user) {
        console.log("user not found");
        return res.sendStatus(401);
      }

      res.sendStatus(200);
    }
  }
  //   res.json({
  //     success: true,
  //   });
};

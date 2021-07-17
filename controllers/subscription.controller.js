const {
  savecustomer,
  retrievecustomer,
  findcustomerandupdate,
  deletecustomer,
} = require("../services/customer.service");
const { sendMailNow } = require("../services/mail.service");
const {
  createcustomer,
  findsubscription,
  createsubscriptionservice,
  savesubscriptionlocal,
  updatesubscription,
  retrievecharge,
  attachpaymentmethodtocustomer,
  linkpaymentmenthodtosubscription,
  deletecustomerfromservice,
  findsubscriptionandupdate,
  stripeeventconstructor,
} = require("../services/subscription.service");
const { findoneuser, updateuser } = require("../services/user.service");
const { errorreturn } = require("../utils/returnerrorschema");

async function retrievecustomerhandler(req, res) {
  // res.send("here")

  const { payment_method } = req.body;
  try {
    let user = await findoneuser({ _id: req.user.id });
    if (!user) {
      return errorreturn(res, 400, "user not found");
    }
    let customer = await retrievecustomer({ user: req.user.id });

    if (customer) {
      return res.json(customer);
    }

    // create customer on stripe with subscription.service

    let subscriptioncustomer = await createcustomer(
      user.email,
      payment_method,
      "stripe"
    );

    if (!subscriptioncustomer) {
      return errorreturn(res, 400, "could not create customer");
    }
    // create customer locally with customer.service

    const customerobject = {
      user: req.user.id,
      email: user.email,
      customerid: subscriptioncustomer.id,
      service: "stripe",
      payment_method: payment_method,
      servername: user.servername || "",
    };
    customer = await savecustomer(customerobject);

    if (!customer) {
      return errorreturn(res, 400, "could not create customer on db");
    }
    return res.json(customer);
  } catch (error) {
    console.log(error);
    return errorreturn(res, 500, "Could not retrieve customer");
  }
}

async function paymentintenthandler(req, res) {
  try {
    const { customerid } = req.body;

    // console.log(req.body, "payment intent");

    const user = await findoneuser({ _id: req.user.id });

    if (!user) {
      return errorreturn(res, 401, "Could not find user");
    }
    // check if user has subscription already,

    let subscriptionlocal = await findsubscription({ user: req.user.id });

    if (subscriptionlocal) {
      // console.log("subscription found");
      if (subscriptionlocal.subscribed) {
        // console.log("already subscribed");
        return errorreturn(res, 401, "subscription already active");
      }
    }

    // create subscription on  service like stripe
    const subscriptionservice = await createsubscriptionservice(customerid);

    if (!subscriptionservice) {
      return errorreturn(res, 401, "could not create subscription");
    }

    if (!subscriptionlocal) {
      subscriptionlocal = await savesubscriptionlocal(
        subscriptionservice.subscription,
        user,
        subscriptionservice.paid
      );
    } else {
      subscriptionlocal = await updatesubscription(
        // subscriptionservice.subscription,
        user,
        true
      );
    }

    if (!subscriptionlocal) {
      return errorreturn(res, 401, "Could not save subscription");
    }
    console.log(subscriptionlocal, "saved");

    res.json(subscriptionservice);
  } catch (error) {
    console.log(error);
    return errorreturn(res, 401, "Could not retrieve payment intent");
  }
}

async function updatesubscriptionhandler(req, res) {
  try {
    const { paymentstatus } = req.body;

    if (!paymentstatus && typeof paymentstatus !== "boolean") {
      return errorreturn(res, 401, "Payment status is required");
    }
    const subscription = await updatesubscription(req.user.id, paymentstatus);

    if (!subscription) {
      return errorreturn(res, 401, "Could not find subscription");
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return errorreturn(res, 500, "Could not update subscription");
  }
}

async function retrivecarddetailshandler(req, res) {
  const customer = await retrievecustomer({ user: req.user.id });

  if (!customer) {
    return errorreturn(res, 401, "Could not locate customer");
  }

  // find the charge containing card details from a service eg: stripe

  const carddetails = await retrievecharge(customer);

  if (!carddetails) {
    return errorreturn(res, 400, "Could not retrieve charge details");
  }

  res.json(carddetails);
}

async function updatebillinghandler(req, res) {
  const { name, payment_method } = req.body;
  console.log(req.body);
  const customer = await retrievecustomer({ user: req.user.id });

  if (!customer) {
    return errorreturn(res, 401, "customer does not exist");
  }

  // attach payment method to customer
  const { customerid } = customer;

  const paymentmethodattachment = await attachpaymentmethodtocustomer(
    customerid,
    payment_method
  );

  if (!paymentmethodattachment) {
    console.log("could not add attachment");
    return errorreturn(res, 401, "could not update billing. try again later ");
  }

  // link payment method to subscription

  const subscription = await findsubscription({ user: req.user.id });

  if (!subscription) {
    console.log("could not find subscription");
    return errorreturn(res, 401, "could not update billing. try again later ");
  }

  const subscriptionlinked = await linkpaymentmenthodtosubscription(
    subscription.subscriptionid,
    payment_method
  );

  if (!subscriptionlinked) {
    console.log("could not link to subscription");

    return errorreturn(res, 401, "could not update billing. try again later");
  }

  // update our models with new payment method

  const customerupdate = await findcustomerandupdate(
    { user: req.user.id },
    { payment_method, name },
    "set"
  );

  if (!customerupdate) {
    console.log("could not update customer");

    return errorreturn(res, 401, "could not update billing. try again later");
  }

  res.json({
    msg: "okay. updated billing",
  });

  // send email of update

  let html = `<p> Your Billing Details have been updated. If you did not initiate this action please immediately send a message to hello@powersms.land about the situation. This is an automated email</p>`;
  let mail = {
    from: "Power SMS Land <no-reply@powersms.land>",
    to: customer.email, // user.email
    subject: `Update on Billing Details`,
    html,
  };

  await sendMailNow(mail);
  console.log("mail sent");
}

async function subscriptiondeletehandler(req, res) {
  // find customer

  const customer = await retrievecustomer({ user: req.user.id });

  if (!customer) {
    return errorreturn(res, 401, "Customer Not found");
  }

  // delete customer stripe also deletes subscription

  const customerdeletedservice = await deletecustomerfromservice(
    customer.customerid
  );

  if (!customerdeletedservice) {
    return errorreturn(res, 401, "Customer Could not be deleted");
  }
  // delete customer local

  const customerdeletedlocal = await deletecustomer({ user: req.user.id });

  if (!customerdeletedlocal) {
    console.log("could not delete customer local");
    return errorreturn(res, 401, "Customer Could not be deleted");
  }
  // delete subscription local

  const subscriptionupdate = await findsubscriptionandupdate(
    { user: req.user.id },
    { subscribed: false },
    "set"
  );

  if (!subscriptionupdate) {
    return errorreturn(res, 401, "Could not update subscription");
  }

  // update user to delete premium service

  const user = await updateuser(
    { _id: req.user.id },
    { premium: false },
    "set"
  );

  if (!user) {
    return errorreturn(res, 401, "Could not update user");
  }

  return res.json({
    msg: "success",
  });

  // send success response
}

async function stripewebhookhandler(req, res) {}
module.exports = {
  retrievecustomerhandler,
  paymentintenthandler,
  updatesubscriptionhandler,
  retrivecarddetailshandler,
  subscriptiondeletehandler,
  updatebillinghandler,
  stripewebhookhandler,
};

//@ts-nocheck
let STRIPE = require("stripe");
let dotenv = require("dotenv");
let Subscription = require("../models/subscription.model");
let User = require("../models/User");
let { returnexpiry } = require("../utils/returnexpirydate");
dotenv.config();
let stripe = STRIPE(process.env.STRIPE_SECRET_KEY);

exports.createcustomer = async (email, payment_method, method = "stripe") => {
  let customer;
  if (method === "stripe") {
    try {
      customer = await stripe.customers.create({
        email,
        payment_method,
        invoice_settings: {
          default_payment_method: payment_method,
        },
      });

      return customer;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return customer;
};

exports.findsubscription = async (query) => {
  try {
    const subscription = await Subscription.findOne(query);

    if (!subscription) return false;

    return subscription;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.savesubscriptionlocal = async (sub, user, paid, method = "stripe") => {
  try {
    console.log("save subscription", user, sub, paid, method);

    const chargeid = sub["latest_invoice"]["charge"];
    const subscriptionid = sub.id;
    const planid = sub.plan.id;
    const productid = sub.plan.product;
    const customerid = sub.customer;
    const subscription = new Subscription({
      subscriptionid,
      customerid,
      chargeid,
      service: method,
      subscribed: paid,
      planid,
      email: user.email,
      productid,
      user: user._id,
      servername: user.servername,
    });

    await subscription.save();

    if (paid) {
      const updated = await User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            premium: true,
            subscriptionid,
            customerid,
            sub_valid_till: returnexpiry(1, 2),
          },
        },
        {
          new: true,
        }
      );
      console.log(updated, "user");
    }

    return subscription;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.updatesubscription = async (user, paymentstatus = false) => {
  console.log("update subscription", user, paymentstatus);
  try {
    const subscription = await Subscription.findOneAndUpdate(
      {
        user,
      },
      {
        $set: {
          subscribed: paymentstatus,
        },
      },
      {
        new: true,
      }
    );
    if (!subscription) {
      return false;
    }

    if (paymentstatus) {
      await User.findOneAndUpdate(
        {
          _id: user,
        },
        {
          $set: {
            premium: true,
            subscriptionid: subscription.subscriptionid,
            customerid: subscription.customerid,
            sub_valid_till: returnexpiry(1, 2),
          },
        },
        {
          new: true,
        }
      );
    }

    return subscription;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.createsubscriptionservice = async (customerid, method = "stripe") => {
  if (method === "stripe") {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerid,
        items: [{ plan: "price_1JB2swA4J7XiGisAjIxtDdCU" }],
        expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        payment_behavior: "allow_incomplete",
      });

      const status = subscription["latest_invoice"]["payment_intent"]["status"];
      const client_secret =
        subscription["latest_invoice"]["payment_intent"]["client_secret"];
      console.log(status, client_secret, 148);
      return {
        status,
        client_secret,
        paid: status === "paid" || status === "succeeded",
        subscription,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
};

exports.retrievecharge = async (customer) => {
  try {
    let charge = null;
    if (customer.service === "stripe") {
      charge = await stripe.paymentMethods.retrieve(customer.payment_method);
    }

    return charge;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.attachpaymentmethodtocustomer = async (customerid, paymentmethod) => {
  try {
    const attach = await stripe.paymentMethods.attach(paymentmethod, {
      customer: customerid,
    });
    const customer = await stripe.customers.update(customerid, {
      invoice_settings: {
        default_payment_method: paymentmethod,
      },
    });
    console.log(attach, customer, 189);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.linkpaymentmenthodtosubscription = async (
  subscriptionid,
  paymentmethod
) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionid, {
      default_payment_method: paymentmethod,
    });
    console.log(subscription, 214);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.deletecustomerfromservice = async (customerid, method = "stripe") => {
  if (method === "stripe") {
    try {
      const customerdeleted = await stripe.customers.del(customerid);

      return customerdeleted;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    console.log("method not chosen delete.customer.service");
    return false;
  }
};
exports.findsubscriptionandupdate = async (query, update, type = "set") => {
  try {
    const result = await Subscription.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
};

exports.stripeeventconstructor = (payload, sig, endpoint) => {
  return stripe.webhooks.constructEvent(payload, sig, endpoint);
};

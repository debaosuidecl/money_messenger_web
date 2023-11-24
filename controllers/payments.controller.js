const {
  findoneuser,
  createonetimelink,
  sendonetimelinktoemail,
} = require("../services/user.service");
// const { check } = require("express-validator");
let uuidv4 = require("uuid");
let bitcore = require("bitcore-lib");
const paypal = require("paypal-rest-sdk");

const jwt = require("jsonwebtoken");
const DIR = "adminlogo/";

const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AY623nOK4XhWTromwyKQgppxHZiDOiZspgfQP5stJ0js2-qosLuZaMXhE9wFt4lNOL3PG8FnzjI8bVJx",
  client_secret:
    "EBVyt4sik489Lp92zboDhsX6tYkPBuwmnlV3hBT7XBFhG0L_Gz12uTVn_-RJKx5dSxtbL3tUWxaEWaMD",
});

async function generateBitcoinAddress(req, res) {
  // const {  } = req.body;
  const user_id = req.user.id;
  try {
    const rand_buffer = bitcore.crypto.Random.getRandomBuffer(32);

    const rand_number = bitcore.crypto.BN.fromBuffer(rand_buffer);

    return res.send({
      msg: "email sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: true,
      message: "an error occured",
    });
  }
}
async function payRequestInit(req, res) {
  // const {  } = req.body;
  const user_id = req.user.id;

  const { PRICE } = req.query;
  if (PRICE == 0) {
    return res.status(400).send({
      error: true,
      message: "Price is invalid",
    });
  }
  try {
    console.log(req.query);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url:
          "http://localhost:8080/api/payments/paypal/success?amount=" +
          PRICE +
          "&username=" +
          user_id,
        cancel_url: "http://localhost:3000/balance?transactioncancelled=1",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "BALANCE",
                sku: "001",
                price: PRICE,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: PRICE,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log({ payment, line: 92 });
        console.log(payment.links)
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            // res.redirect(payment.links[i].href);

            return res.send({
                data: payment.links[i].href,
                
            })
            // break;
          }
        }
      }
    });

    // return res.send({
    //   msg: "email sent",
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: true,
      message: "an error occured",
    });
  }
}

async function balanceSuccess(req, res) {
  try {
    console.log("hit here", req.query);

    let user = await User.findOne({ _id: req.query.username });
    console.log(user);
    if (!user) {
      console.log("user no dey oo");
      return res.redirect("http://localhost:3000/balance?nopermission=1");
    }
  } catch (error) {
    console.log(error);
  }
  const payerId = req.query.PayerID;
  const paymentID = req.query.paymentId;
  console.log(req.query.amount, "na d amount b dis");
  let execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: req.query.amount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentID,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
    
        try {
        //   await user.save();
        const userupdate = await User.findOneAndUpdate(
            { _id: req.query.username },
            {
              $inc: {
                balance: parseFloat(req.query.amount),
              },
            },
            {
                new: true,
            }
            
          );

          console.log(userupdate);
          console.log("success");
        } catch (error) {
          console.log("error");
        }

        res.redirect("http://localhost:3000/payments/paypal?successfulpay=1");
      }
    }
  );
}

module.exports = {
  payRequestInit,
  balanceSuccess,
};

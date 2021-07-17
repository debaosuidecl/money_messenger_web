import React, { useState, useContext } from "react";
import Layout from "../../Component/Layout/Layout";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
// @ts-ignore
import classesMain from "./Subscription.module.css";
import CardContent from "@material-ui/core/CardContent";
import { subscriptionstyle } from "./styles.material";
// stripe
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// Util imports
import CardInput from "./CardInput";
import { AuthContext } from "../../context/Auth.context";
import { LinearProgress } from "@material-ui/core";
import requestModule from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";

function Subscription({ history }) {
  //states

  const [errors, seterrors] = useState([]);
  const [subbing, setsubbing] = useState(false);
  // styles
  const classes = subscriptionstyle();

  // contexts
  const { email } = useContext(AuthContext);
  // stripe
  const elements = useElements();
  const stripe = useStripe();

  const handleSubmitSub = async (event) => {
    setsubbing(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
      seterrors([
        {
          msg: result.error.message,
        },
      ]);
      setsubbing(true);
    } else {
      try {
        const customerres = await requestModule(
          "post",
          `${GLOBAL.domainMain}/api/subscriptions/customer/retrieve`,
          {
            payment_method: result.paymentMethod.id,
            email: email,
          },
          true
        );

        //   if(customerres.data.id){

        //   }

        const res = await requestModule(
          "post",
          `${GLOBAL.domainMain}/api/subscriptions/subscription/payment-intent`,
          {
            payment_method: result.paymentMethod.id,
            email: email,
            customerid: customerres.data.customerid,
          },
          true
        );
        // eslint-disable-next-line camelcase

        const { client_secret, status } = res.data;

        if (status === "requires_source_action") {
          stripe
            .confirmCardPayment(client_secret)
            .then(async function (result) {
              if (result.error) {
                console.log("There was an issue!");
                console.log(result.error);

                seterrors([
                  {
                    msg: result.error,
                  },
                ]);
                clearErrors();

                setsubbing(false);
              } else {
                console.log("You got the money!");

                console.log(result);
                // send request to server to update subscription to paid

                try {
                  let { data } = await requestModule(
                    "post",
                    `${GLOBAL.domainMain}/api/subscriptions/subscription/update`,
                    {
                      paymentstatus: true,
                    },
                    true
                  );
                  console.log(data);
                  history.push({
                    pathname: "/dashboard",
                    state: { success: "You have Subscribed Successfully" },
                  });
                } catch (error) {
                  console.log(error);
                  seterrors(
                    error?.response?.data?.errors || [
                      {
                        msg: "An Error occured",
                      },
                    ]
                  );
                  clearErrors();
                  setsubbing(false);
                }
              }
            });
        } else {
          console.log("You got the money!");
          setsubbing(false);

          history.push({
            pathname: "/dashboard",
            state: { success: "You have Subscribed Successfully" },
          });
        }
      } catch (error) {
        setsubbing(false);

        console.log(error);
        seterrors(
          error?.response?.data?.errors || [
            {
              msg: "An Error occured",
            },
          ]
        );
        clearErrors();
      }
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    // @ts-ignore
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  return (
    // @ts-ignore
    <Layout removesidenav>
      <div className={classes.root}>
        <h4
          style={{
            fontWeight: 800,
            background: "black",
            color: "white",
            padding: 20,
            boxShadow: "1px 0px 14px #eee",
          }}
        >
          Start building your routes and creating awesome campaigns
        </h4>

        <br />
        <Card className={classes.card}>
          <CardContent>
            <CardInput />

            <div className={classes.div}>
              <Button
                variant="contained"
                color="primary"
                disabled={subbing}
                className={classes.button}
                onClick={handleSubmitSub}
              >
                SUBSCRIBE NOW ($1000/Month)
              </Button>
            </div>
            {subbing ? <LinearProgress /> : null}
          </CardContent>
        </Card>
        <br></br>
        <img
          width="400px"
          src="https://www.dermisclinics.co.uk/wp-content/uploads/2020/03/secure-stripe-payment-logo.png"
          alt=""
        />
      </div>
      <div className={classesMain.Errors}>
        {errors &&
          errors.map((e) => {
            return (
              <p className={classesMain.Error} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
    </Layout>
  );
}

export default Subscription;

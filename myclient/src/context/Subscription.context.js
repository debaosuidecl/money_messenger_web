import React, { createContext, useState } from "react";
import REQ from "../helperFunctions/requestModule";
import GLOBAL from "../Containers/GLOBAL/GLOBAL";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// @ts-ignore
export const SubscriptionContext = createContext();

function SubscriptionContextProvider({ children }) {
  const [loadingcard, setloadingcard] = useState(true);

  const [cardnotfound, setcardnotfound] = useState(false);

  // effects

  //   useEffect(() => {}, []);

  const stripe = useStripe();
  const elements = useElements();

  const testcontextconnection = () => {
    console.log("subscription context connected");
  };

  const retrieveCharge = async () => {
    console.log("blah");

    setloadingcard(true);
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/subscriptions/customer/paymentmethod`,
        null,
        true
      );
      setloadingcard(false);

      return data;
    } catch (error) {
      console.log(error?.response);
      setcardnotfound(true);
      setloadingcard(false);

      return {
        error: true,

        msg: error?.response?.data?.errors,
      };
    }
  };

  const updatebilling = async (name) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    console.log("blah");

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name,
      },
    });

    if (result.error) {
      console.log(result.error.message);
      return {
        error: true,

        msg: [
          {
            msg: result?.error?.message,
          },
        ],
      };
    }

    setloadingcard(true);
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/subscriptions/customer/updatepaymentmethod`,
        {
          payment_method: result.paymentMethod.id,
          name: name,
        },
        true
      );
      setloadingcard(false);

      return data;
    } catch (error) {
      console.log(error?.response);
      setcardnotfound(true);
      setloadingcard(false);

      return {
        error: true,

        msg: error?.response?.data?.errors,
      };
    }
  };

  const deletesub = async () => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/subscriptions/subscription/delete`,
        null,
        true
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error?.response);

      return {
        error: true,

        msg: error?.response?.data?.errors,
      };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        retrieveCharge,
        testcontextconnection,
        loadingcard,
        cardnotfound,
        deletesub,
        updatebilling,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export default SubscriptionContextProvider;

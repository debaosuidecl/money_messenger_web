import React, { useState } from "react";
import MyInput from "../Input/Input";
import {
  //   CardNumberElement,
  //   CardExpiryElement,
  //   CardCvcElement,
  CardElement,
} from "@stripe/react-stripe-js";

import CardCapture from "../CreditCards/CardCapture";

const CARD_ELEMENT_OPTIONS = {
  style: {
    showIcon: true,
    base: {
      color: "#111",
      fontFamily: " sans-serif",
      fontSmoothing: "antialiased",
      background: "black",
      fontWeight: 100,
      //   border: "1px solid #eee",

      fontSize: "17px",
      "::placeholder": {
        color: "#aab7c4",
        fontWeight: 100,
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function StripeCard() {
  //   const [brand, setbrand] = useState("");

  //   const onnumberchange = (e) => {
  //     console.log(e);
  //     setbrand(e.brand || "");
  //   };

  return (
    <>
      {/* <MyInput label="Card Holder Name" placeholder="Card Holder Name" />
      <br /> */}
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <br></br>
    </>
    // <>
    //   <CardCapture brand={brand} expiry="" last4="****" />
    //   <p style={{ fontWeight: 100, margin: 0 }}>Card Number</p>
    //   <CardNumberElement
    //     onChange={onnumberchange}
    //     options={CARD_ELEMENT_OPTIONS}
    //   />

    //   <br></br>
    //   <p style={{ fontWeight: 100, margin: 0 }}>Expiry Date</p>
    //   <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />

    //   <br></br>
    //   <p style={{ fontWeight: 100, margin: 0 }}>CVC</p>
    //   <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
    //   <br></br>
    // </>
  );
}

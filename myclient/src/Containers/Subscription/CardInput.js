import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    showIcon: true,
    base: {
      color: "#111",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontWeight: 100,

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

export default function CardInput() {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />;
}

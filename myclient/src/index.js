// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AuthContextProvider from "./context/Auth.context";
import SubscriptionProvider from "./context/Subscription.context";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { QueryClient, QueryClientProvider } from 'react-query'

const stripePromise = loadStripe("pk_test_BVTxf6PPvqo3es8Y5BG6d6oS");
const queryClient = new QueryClient()

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}
ReactDOM.render(
  <QueryClientProvider client={queryClient}>

  <Elements stripe={stripePromise}>
    <AuthContextProvider>

      <SubscriptionProvider>
      <AlertProvider template={AlertTemplate} {...options}>

        <React.StrictMode>
          <App />
        </React.StrictMode>
        </AlertProvider>
      </SubscriptionProvider>
    </AuthContextProvider>
  </Elements>
  </QueryClientProvider>
  ,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

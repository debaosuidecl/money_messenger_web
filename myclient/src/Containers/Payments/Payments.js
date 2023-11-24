import React, { useContext, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import Bitcoin from "../../images/bitcoin.png";
import Paypal from "../../images/paypal.png";
import classes from "./Payments.module.css";
import { AuthContext } from "../../context/Auth.context";
const Payments = () => {
  const { balance } = useContext(AuthContext);
  // const [loading, setloading] = useState(false)


  return (
    <Layout>
      <div className={classes.Payments}>
        <h1 style={{ fontWeight: 700 }}>Top Up Your Balance</h1>
        <br></br>
        <h3 style={{ fontWeight: 200 }}>
          Current Balance: ${balance.toFixed(2)}
        </h3>
        <br></br>
        <br></br>
        <div
          onClick={() => {
            window.location.href = "/payments/paypal";
          }}
          className={classes.PaymentOption}
        >
          <img src={Paypal} height="53px" />
          <p>Pay with Paypal</p>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;

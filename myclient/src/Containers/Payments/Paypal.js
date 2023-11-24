import Layout from "../../Component/Layout/Layout";

import classes from "./Payments.module.css";
import Paypalimg from "../../images/paypal.png";
import { Button, Input, LinearProgress, TextField } from "@material-ui/core";
import { useState, useEffect } from "react";
import requestModule from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import {useAlert} from "react-alert"
import { Alert } from "react-bootstrap";
const Paypal = () => {
  const [amount, setamount] = useState("0");
  const [loading, setloading] = useState(false);
  const alert =  useAlert();
  useEffect(() => {
    // Access the query string from the URL
    const query = window.location.search;
    
    // Update the state with the query string
    // setQueryString(query);

    console.log(query, '18')

    if(query.indexOf("successfulpay") !== -1){
      alert.show("Paypal payment successful!", {
        type: "success"
      })
    }
  }, []);
  const startPaypalProcess = async () => {
    setloading(true)
    try {
      const res = await requestModule(
        "get",
        `${GLOBAL.domainMain}/api/payments/paypal/payinit?PRICE=${amount}`,
        null,
        true
      );
      console.log(res?.data);
      window.location.href = res?.data?.data;
      // setdataownerlist(res.data);
      
      // setloading(false);
    } catch (error) {
      console.log(error?.response?.data);
      // console.log(typeof error)
      alert.show(error?.response?.data?.message ||"could not initiate paypal payment", {
        type: "error",
      })
    } finally{
      setloading(false)
    }
  };

  return (
    <Layout>
    {loading && <LinearProgress/>}
      <div className={classes.Paypal}>
        <div className={classes.PaypalHeader}>
          <img height={40} src={Paypalimg} />
          <h2>Top up with Paypal</h2>
        </div>

        <br></br>

        <div className={classes.InputCont}>
          <TextField
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            fullWidth
            id="standard-basic"
            type="number"x
            label="Enter the amount you want to top up ($)"
            variant="standard"
          />
        </div>
        <br></br>
        <br></br>
        <Button
          onClick={startPaypalProcess}
          style={{
            background: "black",
            color: "white",
          }}
          fullWidth
        >
          Pay $
          {isNaN(parseFloat(amount).toFixed(2))
            ? "0"
            : parseFloat(amount).toFixed(2)}
        </Button>
      </div>
    </Layout>
  );
};

export default Paypal;

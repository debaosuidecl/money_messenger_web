import React, { useState, useContext } from "react";
import MyModal from "../../Component/MyModal/MyModal";

// @ts-ignore
import classes from "./Settings.module.css";
import MyInput from "../../Component/Input/Input";
import { Button } from "@material-ui/core";
import StripeCard from "../../Component/StripeCard/StripeCard";
import { SubscriptionContext } from "../../context/Subscription.context";
import { LinearProgress } from "@material-ui/core";
function UpdateBilling({
  showupdatecardmodal,
  setshowupdatecardmodal,
  seterrors,
  clearErrors,
  setsuccesses,
  carddetailshandler,
}) {
  const [cardname, setcardname] = useState("");
  const [issending, setissending] = useState(false);

  // contexts
  const { updatebilling } = useContext(SubscriptionContext);

  const updatebillingnow = async () => {
    setissending(true);
    const billingres = await updatebilling(cardname);
    console.log(billingres, 26);
    if (billingres?.error) {
      seterrors(billingres.msg);
      clearErrors();
      return;
    }

    setissending(false);
    setshowupdatecardmodal(false);
    setsuccesses([
      {
        msg: "You have successfully updated your billing credentials",
      },
    ]);

    clearErrors();
    carddetailshandler();
  };
  return (
    <MyModal
      maxWidth="700px"
      open={showupdatecardmodal}
      handleClose={() => setshowupdatecardmodal(false)}
    >
      <h3 style={{ fontWeight: 100, textAlign: "left" }}>
        Update Billing Details
      </h3>{" "}
      <br></br>
      <MyInput
        onChange={(e) => setcardname(e.target.value)}
        label="Card Holder Name"
        placeholder="Card Holder Name"
      />
      <br />
      <StripeCard />
      <div className={classes.ButtonCont}>
        <Button
          variant="contained"
          color="primary"
          disabled={!cardname || cardname.length < 2}
          onClick={updatebillingnow}
        >
          Update Billing Details
        </Button>
      </div>
      <br />
      {!issending ? null : <LinearProgress />}
    </MyModal>
  );
}

export default UpdateBilling;

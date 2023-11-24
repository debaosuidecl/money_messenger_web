import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/Auth.context";
import Layout from "../../Component/Layout/Layout";
import MyInput from "../../Component/Input/Input";
import CreditCards from "../../Component/CreditCards/CreditCards";
import Loader from "../../Component/Loader/Loader";
import { Button } from "@material-ui/core";
import DeleteSubscriptionModal from "./DeleteSubscriptionModal";
// import MyModal from "../../Component/MyModal/MyModal";
import UpdateBilling from "./UpdateBilling";
// import StripeCard from "../../Component/StripeCard/StripeCard";
import Routes from "../../Component/Routes/Routes";

//@ts-ignore
import classes from "./Settings.module.css";
import { SubscriptionContext } from "../../context/Subscription.context";
function Settings() {
  //contexts
  const { email, sendupdatepasswordlink } = useContext(AuthContext);
  const { testcontextconnection, retrieveCharge, loadingcard, cardnotfound } =
    useContext(SubscriptionContext);

  //states
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);

  const [sentresetlink, setsentresetlink] = useState(false);

  const [cardbrand, setcardbrand] = useState("");

  const [last4, setlast4] = useState("");
  const [showupdatecardmodal, setshowupdatecardmodal] = useState(false);
  const [expiry, setexpiry] = useState("");

  // const [loadingcard, setloadingcard] = useState(true);

  // const [cardnotfound, setcardnotfound] = useState(false);

  // effects

  useEffect(() => {
    testcontextconnection();

    carddetailshandler();
  }, []);

  const carddetailshandler = async () => {
    const pm = await retrieveCharge();

    if (pm.error) {
      console.log(pm.msg);
      seterrors([
        {
          msg: "could not retrieve payment method",
        },
      ]);
      clearErrors();
      // setcardnotfound(false);
      return;
    }

    console.log(pm);

    setcardbrand(pm?.card?.brand);
    setlast4(pm?.card?.last4);

    const expirymonth = pm?.card?.exp_month;
    let expiryyear = pm?.card?.exp_year;
    if (expiryyear) {
      expiryyear = `${expiryyear}`.substring(2);
    }
    setexpiry(`${expirymonth}/${expiryyear}`);
  };

  const handlesendlink = async () => {
    const res = await sendupdatepasswordlink();

    if (!res) {
      seterrors([
        {
          msg: "Could not send password reset link to your email",
        },
      ]);
      clearErrors();
      return;
    }

    setsentresetlink(true);
    setsuccesses([
      {
        msg: "Successfully sent a reset link to your email",
      },
    ]);

    clearSuccesses();
  };
  const clearSuccesses = () => {
    let timeoutval = 0;
    //@ts-ignore
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const clearErrors = () => {
    let timeoutval = 0;
    //@ts-ignore
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  return (
    // @ts-ignore
    <Layout removesidenav>
      <br />
      <Routes
        routeList={[
          {
            name: "Home",
            link: "/dashboard",
          },
        ]}
      />
      <br></br>
      <UpdateBilling
        showupdatecardmodal={showupdatecardmodal}
        setshowupdatecardmodal={setshowupdatecardmodal}
        seterrors={seterrors}
        clearErrors={clearErrors}
        setsuccesses={setsuccesses}
        carddetailshandler={carddetailshandler}
      />

      <DeleteSubscriptionModal
        setdeletemodalshowing={setdeletemodalshowing}
        deletemodalshowing={deletemodalshowing}
        seterrors={seterrors}
        clearErrors={clearErrors}
      />

      <div className={classes.Settings}>
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Update My Info</h1>
          </div>
        </div>
        <div className={classes.LoadingBody}>
          <br />

          <MyInput label="My Email" value={email} disabled />

          <br />
          <h5 className={classes.Title}>Update Password</h5>

          <div className={classes.ButtonCont}>
            <Button
              variant="contained"
              color="primary"
              style={{
                background: !sentresetlink ? "black" : "green",
              }}
              onClick={handlesendlink}
            >
              {" "}
              {!sentresetlink
                ? "Send Link For Password Update"
                : "Reset Link has been sent to your email. click to resend"}
            </Button>
          </div>
          <br></br>

          {/* <hr />

          <br></br>

          <h5 className={classes.Title}>Update Billing Details </h5>

          <br></br>
          {loadingcard ? (
            <Loader />
          ) : cardnotfound ? (
            <p>Card Not Found</p>
          ) : cardbrand ? (
            <React.Fragment>
              <CreditCards brand={cardbrand} last4={last4} expiry={expiry} />
              <div className={classes.loadmorecont}>
                <button
                  onClick={() => setshowupdatecardmodal(true)}
                  className={classes.loadmore}
                >
                  Update Card Details
                </button>
              </div>
            </React.Fragment>
          ) : null}

          <br></br>
          <h5 className={classes.Title}> End Subscription </h5>

          <div className={classes.ButtonCont}>
            <Button
              variant="contained"
              color="primary"
              style={{
                background: "red",
              }}
              onClick={() => setdeletemodalshowing(true)}
            >
              Cancel Subscription
            </Button>
          </div> */}
        </div>
      </div>

      <div className={classes.Errors}>
        {errors &&
          errors.map((e) => {
            return (
              <p className={classes.Error} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
      <div className={classes.Successes}>
        {successes &&
          successes.map((e) => {
            return (
              <p className={classes.Success} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
    </Layout>
  );
}

export default Settings;

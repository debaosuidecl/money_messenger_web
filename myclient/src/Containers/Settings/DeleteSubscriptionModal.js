import React, { useState, useContext } from "react";
import MyModal from "../../Component/MyModal/MyModal";

// @ts-ignore
import classes from "./Settings.module.css";
import { SubscriptionContext } from "../../context/Subscription.context";
import { LinearProgress } from "@material-ui/core";
// import { withRouter } from "react-router";

function DeleteSubscriptionModal({
  setdeletemodalshowing,
  deletemodalshowing,
  seterrors,
  clearErrors,
}) {
  const [deletingsub, setdeletingsub] = useState(false);
  const { deletesub } = useContext(SubscriptionContext);

  const deletesubhandler = async () => {
    //   const result = deletingsub;
    setdeletingsub(true);
    const subdeleteres = await deletesub();
    // console.log(subdeleteres, 26);
    if (subdeleteres?.error) {
      seterrors(subdeleteres.msg);
      clearErrors();
      return;
    }

    setdeletingsub(false);

    window.location.href = "/dashboard";
    // history.push("/dashboard");
  };
  return (
    <MyModal
      open={deletemodalshowing}
      handleClose={() => {
        setdeletemodalshowing(false);
      }}
      maxWidth="500px"
    >
      <h3 style={{ color: "red", fontWeight: 400 }}>
        Are you sure you want to end your subscription?
      </h3>
      <p style={{ fontWeight: 100 }}>
        This may cause your current campaign, lead and source upload to be
        halted and this action <strong>IS NOT REVERSIBLE</strong>
      </p>

      <br />

      <div className={classes.ButtonCont}>
        <button
          style={{ marginBottom: 15 }}
          onClick={() => deletesubhandler()}
          className={[classes.Option, classes.Red].join(" ")}
        >
          Yes
        </button>
        {/* <br></br> */}
        <button
          onClick={() => setdeletemodalshowing(false)}
          className={[classes.Option, classes.black].join(" ")}
        >
          No
        </button>
      </div>
      <br></br>
      {!deletingsub ? null : <LinearProgress />}
    </MyModal>
  );
}

export default DeleteSubscriptionModal;

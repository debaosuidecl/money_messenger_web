// @ts-nocheck
import classes from "./SMSROUTES.module.css";
import MyModal from "../../Component/MyModal/MyModal";

import React from "react";
import { Link } from "react-router-dom";

function OptionsModal({ open, handleClose, selectedsmsroute }) {
  return (
    <MyModal open={open} maxWidth="600px" handleClose={handleClose}>
      <div className={classes.OptionModal}>
        <h5 style={{ fontWeight: 100 }}>
          Choose an Option for {selectedsmsroute?.name}
        </h5>

        <br />
        <ul>
          <li className={classes.ButtonCont3}>
            <Link to={`/sms-routes/${selectedsmsroute?._id}`}>
              Configure SMS Route
            </Link>
          </li>
          <br />
          <br />
          <li className={classes.ButtonCont3}>
            {/* <Link>Configure SMS Route</Link> */}
            <Link to={`/sms-route-phones/${selectedsmsroute?._id}`}>
              Upload Source Phone numbers
            </Link>
          </li>
        </ul>
      </div>
    </MyModal>
  );
}

export default OptionsModal;

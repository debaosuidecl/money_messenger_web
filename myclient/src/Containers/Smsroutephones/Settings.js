// @ts-nocheck

import React from "react";
import classes from "./Smsroutephones.module.css";
import MyModal from "../../Component/MyModal/MyModal";

function Settings({ open, handleClose, children }) {
  return (
    <div className={classes.Settings}>
      <MyModal open={open} handleClose={handleClose}>
        {children}
      </MyModal>
    </div>
  );
}

export default Settings;

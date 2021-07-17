// @ts-nocheck

import React from "react";
import classes from "./ProcessLoader.module.css";
import Loader from "../../images/loader.svg";
function ProcessLoader() {
  return (
    <div className={classes.ProcessLoader}>
      {/* <div className={classes.ProcessItem}> */}
      <h1>Processing...</h1>
      <img src={Loader} alt="" />
      {/* </div> */}
    </div>
  );
}

export default ProcessLoader;

// @ts-nocheck

import React from "react";
import classes from "./ProcessLoader.module.css";
import Loader from "../../images/loader.svg";
import { Button } from "react-bootstrap";
function ProcessLoader({ action }) {
  return (
    <div className={classes.ProcessLoader}>
      {/* <div className={classes.ProcessItem}> */}
      <h1>Processing...</h1>
      <img src={Loader} alt="" />
      <Button
        variant="contained"
        onClick={() => action(false)}
        color="primary"
        style={{ background: "black", color: "white" }}
      >
        Cancel Test
      </Button>
      {/* </div> */}
    </div>
  );
}

export default ProcessLoader;

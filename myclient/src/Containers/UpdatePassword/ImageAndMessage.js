import React from "react";
// @ts-ignore
import classes from "./UpdatePassword.module.css";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function InvalidCredentails({ src, message }) {
  return (
    <div className={classes.InvalidCredentails}>
      <img height="200px" src={src} alt="" />
      <h2>{message}</h2>

      <Link to="/dashboard">
        <Button variant="contained" color="primary">
          {" "}
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}

export default InvalidCredentails;

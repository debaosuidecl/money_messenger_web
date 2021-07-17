// @ts-nocheck
import classes from "./MySelect.module.css";
import React from "react";

function MySelect(props) {
  return (
    <div className={classes.MyInput}>
      <label>{props.label}</label>
      <select
        className={
          props.bottomBorder
            ? [classes.bottomBorder].join(" ")
            : classes.outline
        }
        {...props}
      >
        {props.children}
      </select>
    </div>
  );
}

export default MySelect;

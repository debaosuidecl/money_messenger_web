// @ts-nocheck
import classes from "./Input.module.css";
import React from "react";

function MyInput(props) {
  return (
    <div className={classes.MyInput}>
      <label>{props.label}</label>
      <input
        // style={{
        //   border: props.bottomBorder ? "none" : undefined,

        //   border: props.bottomBorder ? "1px solid #eee" : "1px solid #eee",
        // }}
        type="text"
        className={
          props.bottomBorder
            ? [classes.bottomBorder].join(" ")
            : classes.outline
        }
        {...props}
      />
    </div>
  );
}

export default MyInput;

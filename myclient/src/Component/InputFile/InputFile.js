// @ts-nocheck

import classes from "./InputFile.module.css";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function InputFile(props) {
  return (
    <div className={classes.InputCont}>
      <label htmlFor="file">
        {props.label} <FontAwesomeIcon icon={faUpload} />
        {/* </button> */}
      </label>
      <input id="file" type="file" {...props} />
    </div>
  );
}

export default InputFile;

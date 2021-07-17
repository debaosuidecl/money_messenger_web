// @ts-nocheck

import React, { useRef } from "react";
import useOutsideAlerter from "../useOutsideAlerter/useOutsideAlerter";
import classes from "./InputSearch.module.css";
// import Loader from "../../images/loader.svg";

function InputSearch(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, (event) => {
    // console.log("bastardos");
    // console.log(props.handleblur);
    console.log(event);
    props.handleblur(event);
  });
  return (
    <div ref={wrapperRef} className={classes.InputCont}>
      <label>{props.label}</label>

      <input type="text" {...props} autocomplete="off" />

      {props.showingselectitmes ? (
        <div className={classes.SelectItems}>
          {props.selectitems.length <= 0 ? (
            <p style={{ fontWeight: 100, padding: 10 }}>Item Does not Exist</p>
          ) : null}
          {props.selectitems &&
            props.selectitems.map((item, i) => {
              return (
                <div
                  onClick={() =>
                    props.selectitemhandler(item, props.identifier)
                  }
                  key={i}
                  className={classes.Item}
                >
                  <p>{item[props.itemname]}</p>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}

export default InputSearch;

// @ts-nocheck

import React from "react";
import Loader from "../../images/loader.svg";
import classes from "./Namecheap.module.css";

function SingleDomain({ domain, fetcherror }) {
  return (
    <div className={[classes.SingleDomain, classes.Flex].join(" ")}>
      <div className={classes.Item}>
        <h4>{domain.domain}</h4>
      </div>
      <div className={classes.Item}>
        {fetcherror ? (
          <p style={{ color: "red" }}>X</p>
        ) : domain.price ? (
          <p>${domain.price.toFixed(2)}</p>
        ) : (
          <img height="18px" src={Loader} />
        )}
      </div>
    </div>
  );
}

export default SingleDomain;

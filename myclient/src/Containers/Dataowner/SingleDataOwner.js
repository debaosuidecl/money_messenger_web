// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./Dataowner.module.css";
function SingleDataowner({ dataowner, showeditDataowner }) {
  return (
    <div className={classes.SingleDataowner}>
      <p style={{ fontWeight: 100 }} to={`/dataowners/${dataowner._id}`}>
        {dataowner.name}
      </p>
      <Link onClick={() => showeditDataowner(dataowner._id, dataowner.name)}>
        Settings <FontAwesomeIcon icon={faEllipsisV} />
      </Link>
    </div>
  );
}

export default SingleDataowner;

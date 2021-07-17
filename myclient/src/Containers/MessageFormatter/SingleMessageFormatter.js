// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./MessageFormatter.module.css";
function SingleVertical({ messageschema }) {
  return (
    <Link
      className={classes.totalLinkForSingleVertical}
      to={`/campaign-message/${messageschema._id}`}
    >
      <div className={classes.SingleVertical}>
        <p>{messageschema.name}</p>
        <Link to={`/campaign-message/${messageschema._id}`}>
          Settings <FontAwesomeIcon icon={faEllipsisV} />
        </Link>
      </div>
    </Link>
  );
}

export default SingleVertical;

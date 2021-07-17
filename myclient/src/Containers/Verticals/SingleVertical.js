// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./Verticals.module.css";
function SingleVertical({ vertical }) {
  return (
    <Link
      className={classes.totalLinkForSingleVertical}
      to={`/vertical/${vertical._id}`}
    >
      <div className={classes.SingleVertical}>
        <p>{vertical.name}</p>
        <Link to={`/vertical/${vertical._id}`}>
          Settings <FontAwesomeIcon icon={faEllipsisV} />
        </Link>
      </div>
    </Link>
  );
}

export default SingleVertical;

// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./SMSROUTES.module.css";
function SingleSMSROUTE({ smsroute, showoptions }) {
  return (
    <p
      className={classes.totalLinkForSingleVertical}
      // to={`/sms-routes/${smsroute._id}`}
    >
      <div className={classes.SingleSMSROUTE}>
        <Link to={`/sms-routes/${smsroute._id}`}>
          <p>{smsroute.name}</p>
        </Link>
        <Link
          onClick={showoptions}
          // to={`/sms-routes/${smsroute._id}`}
        >
          Settings <FontAwesomeIcon icon={faEllipsisV} />
        </Link>
      </div>
    </p>
  );
}

export default SingleSMSROUTE;

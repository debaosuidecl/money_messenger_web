// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./User.module.css";
function SingleUser({ user, showEditDomainGroup }) {
  return (
    <div className={classes.SingleUser}>
      <Link
        to={`/admin/user-management/${user._id}`}
        style={{ fontWeight: 100 }}
        onClick={() => {}}
      >
        {user.fullName}
      </Link>
      <Link
        style={{ color: "white", textDecoration: "none" }}
        // to={`/admin/user-management/${user._id}`}
        onClick={() => showEditDomainGroup(user._id, user.fullName, user.email)}
      >
        Settings <FontAwesomeIcon icon={faEllipsisV} />
      </Link>
    </div>
    // </Link>
  );
}

export default SingleUser;

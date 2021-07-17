// @ts-nocheck

import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import classes from "./DomainGroup.module.css";
function SingleDomainGroup({ domaingroup, showEditDomainGroup }) {
  return (
    <div className={classes.SingleDomainGroup}>
      <p>{domaingroup.name}</p>
      <Link
        onClick={() =>
          showEditDomainGroup(
            domaingroup._id,
            domaingroup.name,
            domaingroup.rotationnumber
          )
        }
      >
        Settings <FontAwesomeIcon icon={faEllipsisV} />
      </Link>
    </div>
  );
}

export default SingleDomainGroup;

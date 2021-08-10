// @ts-nocheck

// import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import { Link } from "react-router-dom";
import classes from "./MyDomains.module.css";
function SingleVertical({ domain }) {
  return (
    <div className={classes.SingleVertical}>
      <div className="">
        <p style={{ fontWeight: 700 }}>{domain.name}</p>
        <p style={{ fontWeight: 100 }}>Vertical: {domain?.traffic?.name}</p>
        <p style={{ fontWeight: 100 }}>
          Data Supplier: {domain?.dataowner?.name}
        </p>
        <p style={{ fontWeight: 100 }}>
          Domain Group: {domain?.domaingroup?.name || "Not Available"}
        </p>
        {/* <p>{domain.traffic.name}</p> */}
      </div>
      {/* <Link
        style={{ color: "white", textDecoration: "none" }}
        to={`/domain/${domain._id}`}
      >
        Settings <FontAwesomeIcon icon={faEllipsisV} />
      </Link> */}
    </div>
    // </Link>
  );
}

export default SingleVertical;

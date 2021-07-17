// @ts-nocheck
import React from "react";
import classes from "./SideNav.module.css";
// import logo from "../Layout/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, withRouter } from "react-router-dom";
// import { faChartLine } from "@fortawesome/free-solid-svg-icons";

function SideNav({ navitems, location }) {
  return (
    <div className={classes.SideNav}>
      <br />
      <br />
      {/* <img src={logo} alt="logo" width={180} /> */}
      {navitems &&
        navitems.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <p
                className={
                  location.pathname.indexOf(item.link) !== -1
                    ? classes.crimson
                    : null
                }
              >
                <FontAwesomeIcon
                  style={{
                    marginRight: 5,
                    color:
                      location.pathname.indexOf(item.link) !== -1
                        ? "crimsion"
                        : "#eee",
                  }}
                  icon={item.icon}
                />
                <Link to={`${item.link}`}>{item.name}</Link>
              </p>
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default withRouter(SideNav);

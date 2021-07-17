//@ts-nocheck

import React from "react";
import classes from "./Routes.module.css";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

function Routes(props) {
  return (
    <div {...props} className={classes.Routes}>
      {props.routeList &&
        props.routeList.map((route, i) => (
          <Link key={i} to={route.link}>
            {route.name} {props.routeList.length - 1 === i ? "" : " > "}
          </Link>
        ))}
    </div>
  );
}

Routes.propTypes = {
  routeList: PropTypes.array,
};

export default Routes;

// @ts-nocheck
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Card.module.css";

function Card({ icon, title, subtitle, children }) {
  return (
    <div className={classes.Card}>
      <FontAwesomeIcon icon={icon} />

      <p className={classes.Majortitle}>{title}</p>
      <p className={classes.subtitle}>{subtitle}</p>
    </div>
  );
}

export default Card;

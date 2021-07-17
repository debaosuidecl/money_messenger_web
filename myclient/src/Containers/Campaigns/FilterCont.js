import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import MyInput from "../../Component/Input/Input";
// @ts-ignore
import classes from "./Campaigns.module.css";
function FilterCont() {
  return (
    <div className={classes.FilterCont}>
      <div className={classes.inputcont}>
        <MyInput
          label="Data Supplier"
          type="text"
          placeholder="Filter by Data supplier"
        />
        <FontAwesomeIcon icon={faFilter} />
      </div>
      <div className={classes.inputcont}>
        <MyInput
          label="Vertical"
          type="text"
          placeholder="Filter by vertical"
        />
        <FontAwesomeIcon icon={faFilter} />
      </div>
      <div className={classes.inputcont}>
        <MyInput
          type="text"
          placeholder="Filter by Domain Group"
          label="Domain Group"
        />
        <FontAwesomeIcon icon={faFilter} />
      </div>
      <div className={classes.inputcont}>
        <MyInput
          type="text"
          label="SMS Route"
          placeholder="Filter by SMS Route"
        />
        <FontAwesomeIcon icon={faFilter} />
      </div>
    </div>
  );
}

export default FilterCont;

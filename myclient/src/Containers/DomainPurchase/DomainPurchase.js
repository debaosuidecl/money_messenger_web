// @ts-nocheck
import React from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./DomainPurchase.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";

function DomainPurchase() {
  return (
    <Layout>
      <div className={classes.Vertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/dashboard",
            },
            {
              name: "Domains",
              link: "/domains",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Select A Domain Purchase Method</h1>
          </div>
        </div>

        <div className={classes.SingleDomainServer}>
          <p>Namecheap</p>
          <Link to="/domain-purchase/namecheap">
            Select <FontAwesomeIcon icon={faChartPie} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default DomainPurchase;

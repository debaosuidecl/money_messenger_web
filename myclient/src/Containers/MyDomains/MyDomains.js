// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./MyDomains.module.css";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
// import Loader from "../../Component/Loader/Loader";
import MyInput from "../../Component/Input/Input";

import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import SingleDomain from "./SingleDomain";

function MyDomains() {
  const [domainlist, setdomainlist] = useState([]);
  const [loading, setloading] = useState(true);

  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/domains`,
        null,
        true
      );
      console.log(res);
      setdomainlist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const searchvaluechangehandler = async (e, option) => {
    setsearchvalue(e.target.value);
    setnomoreresults(false);

    setpage(0);

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}/fuzzy-search?value=${e.target.value}&removenonetraffic=true&oage=${page}`,
        null,
        true
      );

      console.log(data);
      setpage(0);

      if (data.length === 0) {
        // setnomoreresults(true);&removenonetraffic=true
        setdomainlist([]);
      } else
        setdomainlist((prev) => {
          return [...data];
        });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
      console.log(error);
    }
  };

  const setfetchvalue = async (option, newpage) => {
    console.log(option);
    setisfetching(true);
    // setsearchvalue("");

    console.log(newpage);
    setpage(newpage | 0);
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}?page=${newpage}&searchvalue=${searchvalue}`,
        null,
        true
      );

      console.log(data);
      if (data.length === 0) {
        setnomoreresults(true);
      }

      setdomainlist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  return (
    <Layout>
      <div className={classes.Vertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>My Domains</h1>
          </div>

          <div className={classes.createButton}>
            <Link to="/domain-purchase">Create Domains</Link>
            <F icon={faPlusCircle} />
          </div>
        </div>
        <div className={classes.Container2}>
          <MyInput
            placeholder="Search for your Domains..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "domains")}
          />
        </div>

        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : domainlist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="360px" alt="" />

            <p>You have not created any MyDomains yet :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {/* <MyInput
              placeholder="Search for your Domain Groups..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "domains")}
            /> */}
            {domainlist &&
              domainlist.map((domain, i) => {
                return <SingleDomain domain={domain} />;
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && domainlist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("domains", page + 1)}
                  className={classes.loadmore}
                >
                  Load More
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {/* <div className={classes.Errors}>
        {errors &&
          errors.map((e) => {
            return (
              <p
                className={classes.Error}
                key={e.msg}
         
              >
                {e.msg}
              </p>
            );
          })}
      </div> */}
    </Layout>
  );
}

export default MyDomains;

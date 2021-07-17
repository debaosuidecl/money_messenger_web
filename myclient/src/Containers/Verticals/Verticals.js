// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./Verticals.module.css";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import MyInput from "../../Component/Input/Input";

import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
// import Loader from "../../Component/Loader/Loader";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import SingleVertical from "./SingleVertical";

function Verticals() {
  const [verticallist, setverticallist] = useState([]);
  const [loading, setloading] = useState(true);

  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/

  // const [verticallist, setverticallist] = useState([]);

  // const [errors, seterrors] = useState([]);

  useEffect(() => {
    fetchVerticals();
  }, []);

  const searchvaluechangehandler = async (e, option) => {
    setsearchvalue(e.target.value);
    setnomoreresults(false);

    setpage(0);

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}/fuzzy-search?value=${e.target.value}&removenonetraffic=true`,
        null,
        true
      );

      console.log(data);
      setpage(0);

      if (data.length === 0) {
        // setnomoreresults(true);&removenonetraffic=true
        setverticallist([]);
      } else
        setverticallist((prev) => {
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

      setverticallist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  const fetchVerticals = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/verticals`,
        null,
        true
      );
      console.log(res);
      setverticallist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
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
            <h1>My Verticals</h1>
          </div>

          <div className={classes.createButton}>
            <Link to="/create-vertical">Create a Vertical</Link>
            <F icon={faPlusCircle} />
          </div>
        </div>
        <div className={classes.Container2}>
          <MyInput
            placeholder="Search For Verticals..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "verticals")}
          />
        </div>
        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : verticallist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="360px" alt="" />

            <p>No verticals to display :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {verticallist &&
              verticallist.map((vertical, i) => {
                return <SingleVertical vertical={vertical} />;
              })}

            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && verticallist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("verticals", page + 1)}
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
              <p className={classes.Error} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div> */}
    </Layout>
  );
}

export default Verticals;

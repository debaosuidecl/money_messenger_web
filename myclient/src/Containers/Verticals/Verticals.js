// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./Verticals.module.css";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import {
  faPlusCircle,
  faVideo,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import MyInput from "../../Component/Input/Input";
import MyModal from "../../Component/MyModal/MyModal";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import SingleVertical from "./SingleVertical";
import VideoDisplay from "../../Component/VideoDisplay/VideoDisplay";

function Verticals() {
  const [verticallist, setverticallist] = useState([]);
  const [loading, setloading] = useState(true);
  const [showingvideo, setshowingvideo] = useState(false);

  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/

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
        setverticallist([]);
      } else
        setverticallist((prev) => {
          return [...data];
        });
    } catch (error) {
      console.log(error);
    }
  };

  const setfetchvalue = async (option, newpage) => {
    setisfetching(true);
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
    } catch (error) {}
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
      setverticallist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showvideohandler = () => {
    setshowingvideo(true);
  };

  return (
    <Layout>
      <MyModal maxWidth={1000} open={showingvideo}>
        <div className={classes.Flex}>
          <h2 style={{ fontWeight: 200 }}>Power SMS Verticals</h2>
          <F
            style={{ cursor: "pointer" }}
            onClick={() => setshowingvideo(false)}
            icon={faTimesCircle}
          />
        </div>

        <VideoDisplay
          src="https://player.vimeo.com/video/585096244?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          title="Create A Vertical"
        />
      </MyModal>
      <div className={classes.Vertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/dashboard",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>My Verticals</h1>
          </div>

          <div className={classes.Flex}>
            <div className={classes.createButton} onClick={showvideohandler}>
              <span>
                Tutorial <F icon={faVideo} />
              </span>
            </div>

            <div className={classes.createButton}>
              <Link to="/create-vertical">Create a Vertical</Link>
              <F icon={faPlusCircle} />
            </div>
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

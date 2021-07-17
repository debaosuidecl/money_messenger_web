// @ts-nocheck

// import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, LinearProgress } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
// import InputFile from "../../Component/InputFile/InputFile";
import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./SmsAddPhonesStep2.module.css";

function SmsAddPhonesStep2({ history }) {
  const [loading, setloading] = useState(true);
  const [phonegroup, setphonegroup] = useState({});
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  // const [csvphone, setcsvphone] = useState(null);
  const [selectedheader, setselectedheader] = useState("");
  const [isuploading, setisuploading] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    getSMSROUTE(id);
  });

  const getSMSROUTE = async (id) => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/uploadsenderphone/single/${id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);
      if (!data.user) {
        return setloading(false);
      }

      setphonegroup(data);
      setloading(false);
    } catch (error) {
      console.log(error?.response?.data);

      setloading(false);

      seterrors(error?.response?.data); // must be an array;
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const clearSuccesses = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const submithandler = async () => {
    setisuploading(true);
    try {
      // http://localhost:3000/sms-route-phones-create/step1/60abea6822c65b7e5cb0ab73
      const { data } = await axios.post(
        `${GLOBAL.domainMain}/api/uploadsenderphone/scheduleupload/${id}`,
        {
          selectedheader,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setisuploading(false);

      console.log(data);
      history.push(`/sms-route-phones/${phonegroup?.route}`);
      if (!data.user) {
        return setloading(false);
      }

      clearSuccesses();
    } catch (error) {
      setisuploading(false);

      console.log(error?.response?.data);
      seterrors(
        error?.response?.data?.errors || [
          {
            msg: "An error occured during upload",
          },
        ]
      );
      clearErrors();
    }
  };

  return (
    <Layout>
      <div className={classes.SMSROUTE}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/",
            },
            {
              name: "My sms routes",
              link: "/sms-routes",
            },
            {
              name: "Step 1",
              link: `/sms-route-phones/${phonegroup?.route}`,
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>CSV header selection (Step 2)</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : (
            <div className={classes.Container}>
              <div className={classes.InputCont}>
                <h2>INSTRUCTION</h2>
                <br />
                <p>
                  Please select the header that represents the phone number
                  column of the CSV file you uploaded.
                </p>
                <br />
                <br />

                <div className={classes.headersphonegroup}>
                  {phonegroup &&
                    phonegroup.headers.map((h, i) => {
                      return (
                        <p
                          onClick={() => {
                            console.log("lets go");
                            if (selectedheader === h) {
                              setselectedheader("");
                            } else {
                              setselectedheader(h);
                            }
                          }}
                          className={
                            selectedheader === h ? classes.selected : null
                          }
                          key={i}
                        >
                          {h}
                        </p>
                      );
                    })}
                </div>
                <br />
                <Button
                  onClick={submithandler}
                  disabled={!selectedheader}
                  className={classes.buttonClass}
                >
                  Complete
                </Button>
              </div>

              <br />
              <br />

              {isuploading ? <LinearProgress variant="indeterminate" /> : null}
            </div>
          )}
        </div>
      </div>
      <div className={classes.Errors}>
        {errors &&
          errors.map((e) => {
            return (
              <p className={classes.Error} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
      <div className={classes.Successes}>
        {successes &&
          successes.map((e) => {
            return (
              <p className={classes.Success} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
    </Layout>
  );
}

export default SmsAddPhonesStep2;

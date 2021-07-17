// @ts-nocheck

import { Button, LinearProgress } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import InputFile from "../../Component/InputFile/InputFile";
import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./SmsAddPhones.module.css";

function SmsAddPhones({ history }) {
  const [loading, setloading] = useState(true);
  const [smsroute, setsmsroute] = useState({});
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [csvphone, setcsvphone] = useState(null);
  const [isuploading, setisuploading] = useState(false);

  const [phonegroup, setphonegroup] = useState(null);

  const { id } = useParams();
  useEffect(() => {
    getSMSROUTE(id);
    checkIfSMSRouteHasPhoneGroup(id);
  }, []);

  const getSMSROUTE = async (id) => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/smsroutes/single/${id}`,
        null,
        true
      );

      const res2 = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/smsroutes/hasphonegroup/${id}`,
        null,
        true
      );

      console.log(res);
      const data = res.data;
      console.log(data);

      console.log(res2);

      if (res2.phonegroup) {
        // setloading(false);
        setphonegroup(res2.phonegroup);
      }

      if (!data.user) {
        return setloading(false);
      }

      setsmsroute(data);
      setloading(false);
    } catch (error) {
      console.log(error.response.data);

      setloading(false);

      seterrors(error.response.data); // must be an array;
    }
  };

  const checkIfSMSRouteHasPhoneGroup = async ({}) => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/smsroutes/hasphonegroup/${id}`,
        null,
        true
      );

      console.log(data);
      if (!data.user) {
        return setloading(false);
      }

      clearSuccesses();
    } catch (error) {
      console.log(error);
      seterrors(error?.response?.data?.errors || []);
      clearErrors();
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
    const formData = new FormData();
    try {
      formData.append("senderphones", csvphone);

      // http://localhost:3000/sms-route-phones-create/step1/60abea6822c65b7e5cb0ab73
      const { data } = await axios.post(
        `${GLOBAL.domainMain}/api/uploadsenderphone/upload/${id}`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setisuploading(false);

      console.log(data);
      history.push(`/sms-route-phones-create/step2/${data._id}`);
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
            errors: [
              {
                msg: "An error occured during upload",
              },
            ],
          },
        ]
      );
      clearErrors();
    }
  };
  const fileUpload = (e) => {
    console.log(e.target.files[0]);

    if (e.target.files[0]) {
      if (e.target.files[0].size > 20_000_000) {
        seterrors([
          {
            msg: "sorry max size is 20 MB",
          },
        ]);

        clearErrors();
        return;
      }
      setcsvphone(e.target.files[0]);
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
              name: "My sms routes phones",
              link: `/sms-route-phones/${id}`,
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Upload phones for: {smsroute?.name} (Step 1)</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : phonegroup ? (
            <div className={classes.Container}>
              <h1 style={{ fontWeight: 100 }}>
                There are already Phone Numbers on this route
              </h1>
              <br />
              <p style={{ fontWeight: 100 }}>
                If you would like to Replace these Please go back to the{" "}
                <Link to={`/sms-route-phones/${id}`}>Route Phones Page</Link> to
                Delete Already Existing Phones and Add New Ones
              </p>
            </div>
          ) : (
            <div className={classes.Container}>
              <div className={classes.InputCont}>
                <h2>INSTRUCTIONS</h2>
                <br />
                <p>
                  Please Upload a one column CSV of phone numbers or source ids
                  for the route
                </p>
                <br />
                <p>The file upload size has a 50MB limit</p>
                <br />
                <InputFile
                  onChange={fileUpload}
                  accept=".csv"
                  label={
                    csvphone
                      ? "Click to reupload file"
                      : "Click To Upload Phone Number"
                  }
                />
                {csvphone ? (
                  <p style={{ fontWeight: 100 }}>
                    Uploaded File: {csvphone.name}
                  </p>
                ) : (
                  <p></p>
                )}
              </div>

              <br />
              <Button
                onClick={submithandler}
                disabled={!csvphone}
                className={classes.buttonClass}
              >
                Continue
              </Button>

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

export default SmsAddPhones;

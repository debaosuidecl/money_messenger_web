// @ts-nocheck

import { Button, LinearProgress } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
// import { useParams } from "react-router";
// import { Link } from "react-router-dom";
import MyInput from "../../Component/Input/Input";
import InputFile from "../../Component/InputFile/InputFile";
import Layout from "../../Component/Layout/Layout";
// import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
// import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./Leads.module.css";

function UploadLeadStep1({ history }) {
  const [loading, setloading] = useState(true);
  // const [smsroute, setsmsroute] = useState({});
  const [errors, seterrors] = useState([]);
  const [name, setname] = useState("");
  const [successes, setsuccesses] = useState([]);
  const [leadfile, setleadfile] = useState(null);
  const [isuploading, setisuploading] = useState(false);

  // const [phonegroup, setphonegroup] = useState(null);

  // useEffect(() => {

  // }, []
  // );

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
      formData.append("leads", leadfile);

      const { data } = await axios.post(
        `${GLOBAL.domainMain}/api/leads/upload?name=${name}`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setisuploading(false);

      console.log(data);
      history.push(`/leads/create/step2/${data._id}`);
      if (!data.user) {
        return setloading(false);
      }

      clearSuccesses();
    } catch (error) {
      console.log(error.response);
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
      setleadfile(e.target.files[0]);
    }
  };
  return (
    <Layout>
      <div className={classes.LEADS}>
        <Routes
          style={{
            maxWidth: 1400,
          }}
          routeList={[
            {
              name: "Home",
              link: "/",
            },
            {
              name: "All leads",
              link: "/leads",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Upload Lead File (STEP 1)</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          <div className={classes.Container}>
            <div className={classes.InputCont}>
              <h2>INSTRUCTIONS</h2>
              <br />
              <p>
                Please Upload CSV of leads and move on to the next step of
                matching headers
              </p>
              <br />
              <p>The file upload size has a 40MB limit</p>
              <br />
              <MyInput
                placeholder="Please Enter a Friendly Name for this lead file"
                value={name}
                onChange={(e) => setname(e.target.value)}
                label="Enter Lead File Name"
              />
              <br />
              <InputFile
                onChange={fileUpload}
                accept=".csv"
                label={
                  leadfile ? "Click to ReUpload Leads" : "Click To Upload Leads"
                }
              />
              {leadfile ? (
                <p style={{ fontWeight: 100 }}>
                  Uploaded File: {leadfile.name}
                </p>
              ) : (
                <p></p>
              )}
            </div>

            <br />
            <Button
              onClick={submithandler}
              disabled={!leadfile || !name}
              className={classes.buttonClass}
            >
              Continue
            </Button>

            <br />
            <br />

            {isuploading ? <LinearProgress variant="indeterminate" /> : null}
          </div>
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

export default UploadLeadStep1;

// @ts-nocheck

import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Input from "../../Component/Input/Input";
import Layout from "../../Component/Layout/Layout";
import Routes from "../../Component/Routes/Routes";
import classes from "./createVertical.module.css";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";

// import {  } from '@material-ui/core/colors';

function CreateVertical({ history }) {
  const [name, setname] = useState("");
  const [url, seturl] = useState("");
  const [errors, seterrors] = useState([]);

  const handleCreateVertical = async () => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/verticals/create`,
        {
          name,
          url,
        },
        true
      );

      const id = data._id;

      console.log(data);

      history.push(`/vertical/${id}`);
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error?.response?.data?.errors); // must be an array;\

      if (Array.isArray(error.response.data)) {
        seterrors(error.response.data); // must be an array;\
      }

      let timeoutval = 0;
      timeoutval = setTimeout(() => {
        seterrors([]);

        clearTimeout(timeoutval);
      }, 5000);
    }
  };
  return (
    <Layout>
      <div className={classes.CreateVertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/",
            },
            {
              name: "Verticals",
              link: "/verticals",
            },
          ]}
        />
        <br />
        <div className={classes.Container}>
          <div className={classes.title}>
            <h1>Create vertical</h1>
          </div>

          <div className={classes.body}>
            <div className={classes.InputCont}>
              <Input
                label="Enter vertical name*"
                value={name}
                onChange={(e) => {
                  e.preventDefault();

                  setname(e.target.value);
                }}
              />
              <br></br>
              <Input
                label="Enter vertical URL*"
                placeholder="http://"
                value={url}
                onChange={(e) => {
                  e.preventDefault();
                  seturl(e.target.value);
                }}
              />
            </div>
            <h4 className={classes.subtitle}>
              Important Pixels for the Vertical URL
            </h4>
            <div className={classes.ImportantPixels}>
              <div className={classes.Pixel}>
                {"{"}campaignid{"}"}
              </div>
              <div className={classes.Pixel}>
                {"{"}clickid{"}"}
              </div>
            </div>
            <h4 className={classes.subtitle} style={{ fontSize: 12 }}>
              NOTE: Vertical URL must contain {"{"}campaignid{"}"} {"&"} {"{"}
              clickid{"}"} for proper tracking. eg:{" "}
              {
                "https://my-example-vertical-link.com?clickidpixel={clickid}&campaignidpixel={campaignid}"
              }
            </h4>
            <h4 className={classes.subtitle} style={{ fontSize: 12 }}>
              A Postback will be generated for with the schema{" "}
              <strong>
                {
                  "https://powersms.land/api/conversion?clickid={clickidpixel}&campaignid={campaignidpixel}&payout={payoutpixel}"
                }
              </strong>{" "}
              where {"{"}payoutpixel{"}"} will be the expected payout provided
              by the advertiser
            </h4>
            <div className={classes.ButtonCont}>
              <Button
                onClick={handleCreateVertical}
                className={classes.buttonClass}
              >
                Create Vertical
              </Button>
            </div>
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
    </Layout>
  );
}

export default CreateVertical;

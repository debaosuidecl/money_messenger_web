import React from "react";
//@ts-ignore
import classes from "./User.module.css";
import Card from "../../Component/Card/Card";
import { Button } from "@material-ui/core";
function StatisticsCont({
  email,
  campaigncount,
  blockprompt,
  messagecount,
  substatus,
}) {
  return (
    <div className={classes.StatisticsCont}>
      <h3>Email: {email}</h3>
      <br></br>
      <div className={classes.Row}>
        {/* @ts-ignore */}
        <Card
          // icon={faPersonBooth}
          title={campaigncount}
          subtitle="Total Campaigns Created"
        />
        {/* @ts-ignore */}
        <Card
          // icon={faPersonBooth}
          title={messagecount}
          subtitle="Total Messages Sent"
        />
      </div>
      <br></br>

      <hr />
      <p style={{ fontWeight: 100 }}>
        Subscription status:{" "}
        {substatus ? (
          <span className={classes.Active}>active</span>
        ) : (
          <span>inactive</span>
        )}{" "}
      </p>

      {/* <p style={{ fontWeight: 100 }}>Block This User</p> */}
      {/* <Button
        color="primary"
        style={{
          background: "red",
          color: "white",
        }}
        onClick={blockprompt}
      >
        Block User
      </Button> */}
    </div>
  );
}

export default StatisticsCont;

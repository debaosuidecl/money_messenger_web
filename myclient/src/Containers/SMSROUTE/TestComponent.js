// @ts-nocheck
import React, { useState, useEffect } from "react";
import classes from "./SMSROUTE.module.css";
import { Button } from "@material-ui/core";

import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import ProcessLoader from "../../Component/ProcessLoader/ProcessLoader";

function TestComponent({
  open,
  handleClose,
  handleRouteTest,
  istestsending,
  testresult,
  setistestsending,
  testagain,
}) {
  const [input1, setinput1] = useState("");
  const [input2, setinput2] = useState("");
  const [input3, setinput3] = useState("");
  return (
    <MyModal open={open} maxWidth="900px" handleClose={handleClose}>
      <div className={[classes.InputCont, classes.TestMessage].join(" ")}>
        {testresult ? (
          <div className={classes.ResultTestSend}>
            <h1>Result from SMS Server</h1>
            <textarea value={testresult}></textarea>
            <div className={classes.ButtonCont}>
              <Button
                onClick={() => {
                  testagain();
                }}
                className={classes.buttonClass}>
                Test Again
              </Button>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {!istestsending ? null : (
              <ProcessLoader
                message="Sending Message"
                action={setistestsending}
              />
            )}
            <h2 style={{ fontWeight: 100 }}>Send a test message</h2>
            <br />
            <MyInput
              value={input1}
              onChange={(e) => setinput1(e.target.value)}
              label="Source"
              placeholder="Enter your from phone or source id in the exact format as your API DOCS"
            />
            <br></br>
            <MyInput
              value={input2}
              onChange={(e) => setinput2(e.target.value)}
              label="Destination"
              placeholder="Enter your from phone in the exact format as your API DOCS"
            />
            <br />

            <div className={classes.TextAreaCont}>
              <label htmlFor="">Test message</label>
              <textarea
                placeholder="Please Enter the test message"
                value={input3}
                onChange={(e) => setinput3(e.target.value)}></textarea>
            </div>

            <br></br>
            <div>
              <Button
                onClick={() => {
                  handleRouteTest({
                    fromphone: input1,
                    tophone: input2,
                    message: input3,
                  });
                }}
                className={classes.buttonClass}>
                SEND TEST MESSAGE
              </Button>
            </div>
          </React.Fragment>
        )}{" "}
      </div>
    </MyModal>
  );
}

export default TestComponent;

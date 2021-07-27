// @ts-nocheck

import { Button, LinearProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";

import Layout from "../../Component/Layout/Layout";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import MyInput from "../../Component/Input/Input";
import MyModal from "../../Component/MyModal/MyModal";
import Loader from "../../Component/Loader/Loader";
import moment from "moment";
import GLOBAL from "../GLOBAL/GLOBAL";

import classes from "./Campaigns.module.css";
import VerticalImage from "../../images/business2.jpg";
import Grid from "@material-ui/core/Grid";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

// import

// import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateCampaigns({ history }) {
  // const [loading, setloading] = useState(true);
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [isuploading, setisuploading] = useState(false);

  // const [phone, setphone] = useState("");
  // const [dataowner, setdataowner] = useState("");
  const [name, setname] = useState("");
  // const [vertical, setvertical] = useState("");
  const [messageschema, setmessageschema] = useState("");
  const [domaingroup, setdomaingroup] = useState("");
  const [route, setroute] = useState("");
  const [leadgroup, setleadgroup] = useState("");
  const [resultarray, setresultarray] = useState([]);
  const [showingmodal, setshowingmodal] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  const [page, setpage] = useState(0);
  const [valueoffetch, setvalueoffetch] = useState("");
  const [valueoffetchfriendly, setvalueoffetchfriendly] = useState("");
  const [errorinfetch, seterrorinfetch] = useState(false);
  const [searchvalue, setsearchvalue] = useState("");
  const [nomoreresults, setnomoreresults] = useState(false);
  const [scheduletype, setscheduletype] = useState("off");
  const [scheduledate, setscheduledate] = useState(new Date());
  const [scheduletime, setscheduletime] = useState(new Date());

  useEffect(() => {
    // getLeadGroup(id);
  }, []);

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
    let dt = scheduledate;
    let isodt = new Date();

    if (scheduletype === "on") {
      console.log("schedule", scheduletype);
      // console.log(scheduledate, "date");
      // console.log(scheduletime, "time");
      dt.setHours(0);
      dt.setMinutes(0);
      dt.setHours(dt.getHours() + scheduletime.getHours());
      dt.setMinutes(dt.getMinutes() + scheduletime.getMinutes());
      console.log(dt, new Date());

      if (new Date() > dt) {
        console.log("new date ");
        // return console.log("");
      }

      // console.log(dt.toISOString());

      isodt = dt;
    }
    // console.log(validatepost());

    // if(!validatepost()){

    // }

    // return;

    // return;
    setisuploading(true);
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/campaigns/create`,
        {
          // dataowner: dataowner._id,
          domaingroup: domaingroup._id,
          leadgroup: leadgroup._id,
          name: name,
          dateofschedule: isodt,
          scheduletype,

          ischeduled: scheduletype === "on" ? true : false,
          // vertical: vertical._id,
          messageschema: messageschema._id,
          route: route._id,
        },
        true
      );

      setisuploading(false);

      localStorage.setItem("campaign_set_success", "1");
      // setisuploading(false);
      // console.log(data);
      history.push(`/campaigns`);
      // if (!data.user) {
      //   return setloading(false);
      // }
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

  const selectoption = (result) => {
    if (valueoffetch === "dataowner") {
      // setdataowner(result);
    }
    if (valueoffetch === "verticals") {
      // setvertical(result);
    }
    if (valueoffetch === "domaingroup") {
      setdomaingroup(result);
    }
    if (valueoffetch === "messageschema") {
      setmessageschema(result);
    }
    if (valueoffetch === "leads") {
      setleadgroup(result);
    }
    if (valueoffetch === "smsroutes") {
      setroute(result);
    }
    handleClose();
  };

  const validatepost = () => {
    if (
      // !dataowner ||
      // !vertical ||
      !domaingroup ||
      !messageschema ||
      !leadgroup ||
      !route ||
      !name
    ) {
      return true;
    }

    let dt = scheduledate;
    // let isodt = "";
    if (scheduletype === "on") {
      console.log("schedule", scheduletype);
      // console.log(scheduledate, "date");
      // console.log(scheduletime, "time");
      dt.setHours(0);
      dt.setMinutes(0);
      dt.setHours(dt.getHours() + scheduletime.getHours());
      dt.setMinutes(dt.getMinutes() + scheduletime.getMinutes());
      console.log(dt, new Date());

      if (new Date() > dt) {
        console.log("new date ");
        return true;
      }

      // console.log(dt.toISOString());

      // isodt = dt.toISOString();
    }
    return false;
  };

  const inputList = [
    {
      name: "Select a domain group *",
      value: domaingroup,
      set: setdomaingroup,
      friendlyname: "Domain Group",

      action: () => setfetchvalue("domaingroup", "Domain Group"),
    },
    {
      name: "Select a message schema *",
      value: messageschema,
      set: setmessageschema,
      friendlyname: "Message Schema",

      //   action: vertical
      action: () => setfetchvalue("messageschema", "Message Schema"),
    },
    {
      name: "Select a lead group *",
      value: leadgroup,
      set: setleadgroup,
      //   action: vertical
      friendlyname: "Lead Group",

      action: () => setfetchvalue("leads", "Lead Group"),
    },
    {
      name: "Select an SMS route *",
      value: route,
      set: setroute,
      //   action: vertical
      friendlyname: "SMS Route",

      action: () => setfetchvalue("smsroutes", "Route"),
    },
  ];

  const handleClose = () => {
    setisfetching(true);
    setshowingmodal(false);
    setresultarray([]);
    setnomoreresults(false);
    setpage(0);
    setvalueoffetch("");
  };
  const setfetchvalue = async (option, friendlyName, newpage) => {
    console.log(option);
    setisfetching(true);
    setvalueoffetch(option);
    setshowingmodal(true);
    setsearchvalue("");

    setvalueoffetchfriendly(friendlyName);
    console.log(newpage);
    setpage(newpage | 0);
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}?page=${newpage}&campaigncreation=1&searchvalue=${searchvalue}&removenonetraffic=true`,
        null,
        true
      );

      console.log(data);
      if (data.length === 0) {
        setnomoreresults(true);
      }

      setresultarray((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };

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
        setresultarray([]);
      } else
        setresultarray((prev) => {
          return [...data];
        });
    } catch (error) {
      seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
  };

  return (
    <Layout>
      <MyModal open={showingmodal} maxWidth="600px" handleClose={handleClose}>
        <div className={classes.SelectionModal}>
          <h3> Select {valueoffetchfriendly}</h3>
          <br />

          <MyInput
            placeholder="Search"
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, valueoffetch)}
            label={`Search ${valueoffetchfriendly} list`}
          ></MyInput>
          {/* <br /> */}

          <div className={classes.results}>
            {!isfetching && resultarray.length <= 0 ? (
              <div style={{ textAlign: "center" }}>
                <img src={VerticalImage} height="250px" alt="" />
                <p style={{ fontWeight: 100 }}>
                  {" "}
                  {valueoffetchfriendly} not found{" "}
                </p>
              </div>
            ) : null}
            {resultarray &&
              resultarray.map((result) => (
                <div
                  onClick={() => selectoption(result)}
                  className={classes.Card}
                  key={result._id}
                >
                  <h4>
                    <b>{result.friendlyname || result.name}</b>
                  </h4>
                  <p>{moment(result.date).format("MMMM Do YYYY")}</p>
                </div>
              ))}

            {isfetching ? (
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            ) : null}

            <br />
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && resultarray.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() =>
                    setfetchvalue(valueoffetch, valueoffetchfriendly, page + 1)
                  }
                  className={classes.loadmore}
                >
                  Load More
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </MyModal>
      <div className={classes.CAMPAIGNS}>
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
              name: "My Campaigns",
              link: "/campaigns",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>CAMPAIGN CREATION</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          <div className={classes.Container}>
            <div className={classes.InputCont}>
              <br />
              <div className={classes.headersleadgroup}>
                <div className={classes.InputCont}>
                  <MyInput
                    onChange={(e) => setname(e.target.value)}
                    value={name}
                    label="Enter Campaign Name"
                    placeholder="Campaign name eg. My Awesome Campaign"
                  ></MyInput>
                </div>
                <br />
                <div className={classes.InputCont}>
                  {inputList.map((item) => (
                    <div
                      // map={item.name}
                      key={item.name}
                      onClick={item.action}
                      // style={{
                      //   borderLeft: item.value
                      //     ? "9px solid lightgreen"
                      //     : "9px solid #111",
                      // }}
                      className={
                        item.value
                          ? [classes.SelectContainer, classes.active].join(" ")
                          : classes.SelectContainer
                      }
                    >
                      <p>
                        {item.value ? (
                          <>
                            <strong>{item.friendlyname}: </strong>
                            <span>
                              {item.value?.friendlyname
                                ? item.value.friendlyname
                                : item.value.name}
                            </span>
                          </>
                        ) : (
                          item.name
                        )}
                        <br />
                        <br />
                        {item.friendlyname === "Domain Group" && item.value ? (
                          <>
                            <font>
                              <strong>Vertical:</strong>{" "}
                              {item.value?.traffic.name}
                            </font>
                            <br />
                            <br />
                            <font>
                              <strong>Data owner:</strong>{" "}
                              {item.value?.dataowner.name}
                            </font>
                          </>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitchesChecked"
                    // defaultChecked

                    value={scheduletype}
                    onChange={(e) => {
                      console.log(e.target.value);

                      if (scheduletype === "off") {
                        setscheduletype("on");
                      } else {
                        setscheduletype("off");
                      }
                    }}
                  />
                  <label
                    style={{ fontWeight: 100, cursor: "pointer" }}
                    className="custom-control-label"
                    htmlFor="customSwitchesChecked"
                  >
                    Toggle to set to schedule mode
                  </label>
                </div>

                {/* {scheduletype === "off" ? null : ( */}
                <div
                  className={
                    scheduletype === "off"
                      ? classes.schedule
                      : classes.AnimateIn
                  }
                >
                  <br></br>
                  <h6>Schedule Time</h6>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-between">
                      {/* <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        // value={selectedDate}
                        // onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      /> */}
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        style={{ width: "100%" }}
                        label="Select Scheduled Day"
                        format="MM/dd/yyyy"
                        // value={selectedDate}
                        value={scheduledate}
                        disablePast
                        onChange={(e) => {
                          console.log(e, "date");
                          setscheduledate(new Date(e));
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        style={{ width: "100%" }}
                        label="Time picker"
                        fullWidth
                        // value={selectedDate}
                        value={scheduletime}
                        onChange={(e) => {
                          console.log(e);

                          // console.log(new Date(e).getHours())

                          setscheduletime(new Date(e), "time");
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>

                  {/* <Form.Control type="date" name="date_of_birth" />
                  <br />
                  <Form.Control type="time" name="date_of_birth" /> */}
                </div>
                {/* )} */}
              </div>
              <br />
              <Button
                onClick={submithandler}
                disabled={validatepost()}
                className={classes.buttonClass}
              >
                Complete
              </Button>
            </div>

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

export default CreateCampaigns;

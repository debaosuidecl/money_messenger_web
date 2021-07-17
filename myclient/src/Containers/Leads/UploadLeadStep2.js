// @ts-nocheck

// import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, LinearProgress } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
// import InputFile from "../../Component/InputFile/InputFile";
import Layout from "../../Component/Layout/Layout";
import MySelect from "../../Component/MySelect/MySelect";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./Leads.module.css";

function UploadLeadStep2({ history }) {
  const [loading, setloading] = useState(true);
  const [leadgroup, setleadgroup] = useState({});
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [isuploading, setisuploading] = useState(false);
  const [variableheaders, setvariableheaders] = useState([]);
  const { id } = useParams();
  const [phone, setphone] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [address, setaddress] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  useEffect(() => {
    getLeadGroup(id);
  }, []);

  const getLeadGroup = async (id) => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/leads/single/${id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);
      if (!data.user) {
        return setloading(false);
      }

      setleadgroup(data);
      setvariableheaders(data.headers);
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

    if (!phone) {
      setisuploading(false);
      seterrors([
        {
          msg: "Phone Filled is required",
        },
      ]);

      clearErrors();
      return;
    }
    try {
      // http://localhost:3000/sms-route-phones-create/step1/60abea6822c65b7e5cb0ab73
      const { data } = await axios.post(
        `${GLOBAL.domainMain}/api/leads/scheduleupload/${id}`,
        {
          phone,
          firstname,
          lastname,
          address,
          city,
          state,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setisuploading(false);

      console.log(data);
      history.push(`/leads`);
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

  const checkDisabled = (val) => {
    let values = [phone, firstname, lastname, address, city, state];
    return values.map((v) => val === v).indexOf(true) !== -1;
  };
  const options =
    variableheaders &&
    variableheaders.map((h, i) => {
      return (
        <option disabled={checkDisabled(h)} key={i}>
          {h}
        </option>
      );
    });

  const SelectData = [
    {
      label: "Phone*",
      state: phone,
      func: setphone,
    },
    {
      label: "First Name",
      state: firstname,
      func: setfirstname,
    },
    {
      label: "Last Name",
      state: lastname,
      func: setlastname,
    },
    {
      label: "Address",
      state: address,
      func: setaddress,
    },
    {
      label: "City",
      state: city,
      func: setcity,
    },
    {
      label: "State",
      state: state,
      func: setstate,
    },
  ];

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
              name: "My Leads",
              link: "/leads",
            },
            {
              name: "Step 1",
              link: `/leads/create/step1`,
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
          ) : leadgroup?.status && leadgroup?.status !== "matching headers" ? (
            <div className={classes.Container}>
              <h2>Upload is not in the Matching header stage anymore</h2>

              <p>Upload status : {leadgroup?.status}</p>
            </div>
          ) : (
            <div className={classes.Container}>
              <div className={classes.InputCont}>
                <h2>INSTRUCTION</h2>
                <br />
                <p>
                  Please select the headers extracted from your CSV that
                  represents the below data points
                </p>
                <br />
                <br />

                <div className={classes.headersleadgroup}>
                  {SelectData.map((item) => (
                    <div className="">
                      <MySelect
                        value={item.state}
                        onChange={(e) => {
                          item.func(e.target.value);
                          //   adjustvariableheaders(e.target.value);
                        }}
                        label={item.label}
                      >
                        <option value="">
                          {/* -- Select Header From Dropdown (Nothing Selected) -- */}
                          --
                        </option>

                        {options}
                      </MySelect>
                      <br />
                    </div>
                  ))}
                </div>
                <br />
                <Button
                  onClick={submithandler}
                  disabled={!phone}
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

export default UploadLeadStep2;

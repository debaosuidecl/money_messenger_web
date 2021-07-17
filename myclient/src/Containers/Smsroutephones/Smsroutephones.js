// @ts-nocheck

import {
  faPlusCircle,
  faSyncAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinearProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import Settings from "./Settings";
import socketIOClient from "socket.io-client";

import classes from "./Smsroutephones.module.css";

function Smsroutephones({ history }) {
  const [loading, setloading] = useState(true);
  const [smsroutephonegroup, setsmsroutephonegroup] = useState(null);
  const [smsroute, setsmsroute] = useState({});
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [deletemodal, showdeletemodal] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    getSMSROUTE(id);
    const _socket1 = socketIOClient(GLOBAL.uploadlead1);

    [_socket1].forEach((_s) => {
      _s.on("sourceupload", (_group) => {
        console.log(_group, "upload");
        setsmsroutephonegroup((myphonegroup) => {
          if (myphonegroup._id === _group._id) {
            return _group;
          }
        });
      });
      _s.on("sourcedeletedone", (_group) => {
        console.log(_group, "delete");
        setsmsroutephonegroup((myphonegroup) => {
          if (myphonegroup._id === _group._id) {
            return null;
          }
        });
      });
    });

    // setInterval(() => {}, 300000);
  }, []);

  // useEffect(() => {
  //   setInterval(()=>getSMSROUTE(id), 9000);
  //   return () => {
  //     // cleanup
  //   }
  // }, [input])
  const getSMSROUTE = async (id) => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/uploadsenderphone/phone-group-uploads/${id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);
      if (data.phonesgroup === null) {
        setsmsroutephonegroup(null);
        return setloading(false);
      }

      setsmsroutephonegroup(data.phonesgroup);
      setsmsroute(data.route);

      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
    }
  };
  const scheduleDeletion = async () => {
    try {
      const res = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/uploadsenderphone/scheduledeleting/${id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      if (data.user) {
        setsuccesses([
          {
            msg: "Deletion Process has begun",
          },
        ]);

        clearSuccesses();

        setsmsroutephonegroup(data);
        showdeletemodal(false);
      }
      // if (!data.phonesgroup) {
      //   return setloading(false);
      // }

      // setsmsroutephonegroup(data.phonesgroup);
      // setsmsroute(data.route);

      // setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
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

  return (
    <Layout>
      <Settings open={deletemodal} handleClose={() => showdeletemodal(false)}>
        <h3 style={{ fontWeight: 400 }}>
          Are you sure you want to delete the phone numbers on this route?
        </h3>
        <br />
        <p style={{ fontWeight: 100 }}>
          Note that this can take up to 2 to 3 minutes to be deleted and cannot
          be reversed!
        </p>
        <br />

        <div className={[classes.Flex, classes.ButtonCont].join(" ")}>
          <button
            onClick={() => {
              scheduleDeletion();
            }}
            style={{ marginRight: 10, background: "crimson", color: "white" }}
          >
            Yes
          </button>
          <button
            onClick={() => showdeletemodal(false)}
            style={{ marginRight: 10, background: "black", color: "white" }}
          >
            No
          </button>
        </div>
      </Settings>
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
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Phone Numbers: {smsroute?.name}</h1>
          </div>

          <div
            className={
              loading
                ? [classes.Trailing, classes.Rolling].join(" ")
                : classes.Trailing
            }
          >
            Reload{" "}
            <FontAwesomeIcon
              onClick={() => {
                setloading(true);
                getSMSROUTE(id);
              }}
              style={{ cursor: "pointer" }}
              icon={faSyncAlt}
            />
          </div>
        </div>

        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : (
            <div className={classes.Container}>
              <div className={classes.InputCont}>
                {!smsroutephonegroup ? (
                  <div className={classes.NoPhoneNumbers}>
                    <h2 style={{ fontWeight: 100 }}>
                      No Phone Numbers are Present
                    </h2>
                    <br />
                    <button
                      onClick={() =>
                        history.push(`/sms-route-phones-create/step1/${id}`)
                      }
                      className={classes.Button}
                    >
                      Add Phone Numbers <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={classes.Group}>
                      <div className={classes.Leading}>
                        <p>{smsroutephonegroup?.originalname}</p>
                        <br />
                        <div className={classes.Flex}>
                          <p style={{ fontWeight: 100, marginRight: 10 }}>
                            Total Uploaded: {smsroutephonegroup?.uploadCount}
                          </p>
                        </div>

                        <br />
                      </div>
                    </div>

                    <div className={classes.Flex}>
                      <p style={{ marginRight: 10 }}>Status: </p>
                      <p
                        className={classes.status}
                        style={{
                          background:
                            smsroutephonegroup?.status === "scheduled"
                              ? "gold"
                              : smsroutephonegroup?.status === "processing"
                              ? "lightblue"
                              : smsroutephonegroup?.status === "deleting"
                              ? "crimson"
                              : "lightgreen",
                          color: "white",
                        }}
                      >
                        {smsroutephonegroup?.status}
                      </p>
                    </div>
                    <br />

                    <div className={classes.Trailing}>
                      {smsroutephonegroup?.status === "deleting" ? (
                        <>
                          <LinearProgress />
                          <p style={{ fontWeight: 100 }}>
                            This may take up to 3 minutes to complete
                          </p>
                        </>
                      ) : (
                        <button onClick={() => showdeletemodal(true)}>
                          Delete <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      )}
                    </div>

                    <br />
                  </>
                )}
              </div>
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

export default Smsroutephones;

// @ts-nocheck

import {
  faPause,
  faPlay,
  faPlusCircle,
  faStop,
  faSyncAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./Campaigns.module.css";
import socketIOClient from "socket.io-client";
import MyModal from "../../Component/MyModal/MyModal";
import Info from "../../Component/Info/Info";
import { Link } from "react-router-dom";
import MyInput from "../../Component/Input/Input";
import FilterCont from "./FilterCont";

function Campaigns({ history }) {
  const [loading, setloading] = useState(true);
  const [campaigns, setcampaigns] = useState([]);
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [abortmodalshowing, setabortmodalshowing] = useState(false);
  const [selectedcampaign, setselectedlead] = useState(null);
  const [infopanel, setinfopanel] = useState(null);
  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/

  useEffect(() => {
    const _socket1 = socketIOClient(GLOBAL.campaigns);

    [_socket1].forEach((_s) => {
      _s.on("ping", (pingval) => {
        console.log(pingval);
      });
      _s.on("status", (_group) => {
        console.log(_group);
        setcampaigns((mycampaigns) =>
          [...mycampaigns].map((l) => {
            if (l._id === _group._id) {
              return _group;
            }

            return l;
          })
        );
      });
      _s.on("status_click", (_group) => {
        console.log(_group);
        setcampaigns((mycampaigns) =>
          [...mycampaigns].map((l) => {
            if (l._id === _group._id) {
              return {
                ...l,
                clickcount: _group.clickcount,
              };
            }

            return l;
          })
        );
      });
      _s.on("status_conversion", (_group) => {
        console.log(_group);
        setcampaigns((mycampaigns) =>
          [...mycampaigns].map((l) => {
            if (l._id === _group._id) {
              return {
                ...l,
                conversioncount: _group.conversioncount,
                payout: _group.payout,
              };
            }

            return l;
          })
        );
      });
    });

    getcampaigns();
  }, []);

  const searchvaluechangehandler = async (e, option) => {
    setsearchvalue(e.target.value);
    setnomoreresults(false);

    setpage(0);

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}/fuzzy-search?value=${e.target.value}&removenonetraffic=true&oage=${page}`,
        null,
        true
      );

      console.log(data);
      setpage(0);

      if (data.length === 0) {
        // setnomoreresults(true);&removenonetraffic=true
        setcampaigns([]);
      } else
        setcampaigns((prev) => {
          return [...data];
        });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
      console.log(error);
    }
  };

  const setfetchvalue = async (option, newpage) => {
    console.log(option);
    setisfetching(true);
    // setsearchvalue("");

    console.log(newpage);
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

      setcampaigns((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  const getcampaigns = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/campaigns`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      setcampaigns(data);

      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
    }
  };

  const deletecampaign = async () => {
    seterrors([]);
    try {
      const res = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/campaigns/delete/${selectedcampaign?._id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      getcampaigns();
      // setcampaigns(data);
      setsuccesses([
        {
          msg: "Successfully delete " + selectedcampaign.name,
        },
      ]);
      // setsmsroute(data.route);
      clearSuccesses();

      // clearErrors();
      setdeletemodalshowing(false);
      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
      clearErrors();
    }
  };
  const abortcampaign = async () => {
    seterrors([]);
    try {
      const res = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/campaigns/edit/abort/${selectedcampaign?._id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      // getcampaigns();

      setcampaigns((campaigns) => {
        return [...campaigns].map((c) => {
          if (c._id === data._id) {
            return {
              ...c,
              status: data.status,
            };
          }

          return c;
        });
      });
      // setcampaigns(data);
      setsuccesses([
        {
          msg: "Successfully delete " + selectedcampaign.name,
        },
      ]);
      // setsmsroute(data.route);
      clearSuccesses();

      // clearErrors();
      setabortmodalshowing(false);
      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
      clearErrors();
    }
  };
  const pauseplaycampaign = async (action, campaign) => {
    seterrors([]);
    try {
      const res = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/campaigns/edit/${action}/${campaign?._id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      // getcampaigns();
      setcampaigns((campaigns) => {
        return [...campaigns].map((c) => {
          if (c._id === data._id) {
            return {
              ...c,
              status: data.status,
            };
          }

          return c;
        });
      });
      // setcampaigns(data);
      setsuccesses([
        {
          msg:
            "Successfully " + action === "resume"
              ? "resumed "
              : "paused " + selectedcampaign.name,
        },
      ]);
      // setsmsroute(data.route);
      clearSuccesses();

      // clearErrors();
      setdeletemodalshowing(false);
      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
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

  const deleteModal = (
    <MyModal
      open={deletemodalshowing}
      handleClose={() => {
        setdeletemodalshowing(false);
      }}
      maxWidth="500px"
    >
      <h6 style={{ color: "red", fontWeight: 100 }}>
        Are you sure you want to abort {selectedcampaign?.name}?
      </h6>
      <p style={{ fontWeight: 100 }}>
        This will stop the current campaign. Click "Yes" to proceed
      </p>

      <div className={classes.ButtonCont}>
        <button
          onClick={() => deletecampaign()}
          className={[classes.Option, classes.Red].join(" ")}
        >
          Yes
        </button>
        <button
          style={{ background: "black" }}
          onClick={() => setdeletemodalshowing(false)}
          className={[classes.Option].join(" ")}
        >
          No
        </button>
      </div>
    </MyModal>
  );
  const abortModal = (
    <MyModal
      open={abortmodalshowing}
      handleClose={() => {
        setabortmodalshowing(false);
      }}
      maxWidth="500px"
    >
      <h6 style={{ color: "red", fontWeight: 100 }}>
        Are you sure you want to abort {selectedcampaign?.name}?
      </h6>
      <p style={{ fontWeight: 100 }}>
        This will stop the current campaign. Click "Yes" to proceed
      </p>

      <div className={classes.ButtonCont}>
        <button
          onClick={() => abortcampaign()}
          className={[classes.Option, classes.Red].join(" ")}
        >
          Yes
        </button>
        <button
          style={{ background: "black" }}
          onClick={() => setdeletemodalshowing(false)}
          className={[classes.Option].join(" ")}
        >
          No
        </button>
      </div>
    </MyModal>
  );
  return (
    <Layout>
      {deleteModal}
      {abortModal}
      <Info show={infopanel != null} handleClose={() => setinfopanel(null)}>
        {infopanel}
      </Info>
      <div className={classes.CAMPAIGNS}>
        <Routes
          style={{ maxWidth: 1400 }}
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
            <h1>My Campaigns</h1>
          </div>

          <div className={classes.Flex}>
            <div
              onClick={() => {
                history.push(`/campaigns/create`);
              }}
              className=""
              style={{ marginRight: 20, cursor: "pointer" }}
            >
              Create Campaign{" "}
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faPlusCircle}
              />
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
                  getcampaigns();
                }}
                style={{ cursor: "pointer" }}
                icon={faSyncAlt}
              />
            </div>
          </div>
        </div>
        <div>
          <div className={classes.Container2}>
            <MyInput
              placeholder="Search for your Campaigns..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "campaigns")}
            />
          </div>

          {/* <FilterCont /> */}
          {loading ? (
            <div className={classes.LoadingBody}>
              <MySkeletonLoader />
            </div>
          ) : campaigns.length <= 0 && !loading ? (
            <div className={classes.LoadingBody}>
              <div className={classes.Container}>
                <div className={classes.InputCont}>
                  {campaigns.length <= 0 ? (
                    <div className={classes.NoPhoneNumbers}>
                      <h2 style={{ fontWeight: 100 }}>You have No Campaigns</h2>
                      <br />
                      <button
                        onClick={() => history.push(`/campaigns/create/step1`)}
                        className={classes.Button}
                      >
                        Create One <FontAwesomeIcon icon={faPlusCircle} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          {/* {campaigns.length <= 0 && !loading ? null : <FilterCont />} */}

          {!loading && campaigns && campaigns.length > 0 ? (
            <div className={classes["search-table-outter"]}>
              <table className={classes["search-table"]}>
                <tr>
                  <th>Campaign Name</th>
                  <th>No. of Leads</th>
                  <th>Total Sent</th>
                  <th>Payout</th>
                  <th>Clicks</th>
                  <th>Conversions</th>
                  <th>Data Supplier</th>
                  <th>Vertical</th>
                  <th>Domain Group</th>
                  <th>SMS Route</th>
                  <th>Upload date</th>
                  <th>Status</th>
                  <th>Campaign actions</th>
                </tr>

                {campaigns &&
                  campaigns.map((campaign) => {
                    return (
                      <tr className={classes.LeadGroup} key={campaign._id}>
                        <td style={{ fontWeight: 100 }}>{campaign?.name}</td>

                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.leadgroup?.totalProcessed || "#no-lead"}
                        </td>

                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.totalsent}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.payout || 0}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.clickcount || 0}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.conversioncount || 0}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.dataowner?.name}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.vertical?.name}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {campaign?.domaingroup?.name}
                        </td>
                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          <Link to={`/sms-routes/${campaign?.smsroute?._id}`}>
                            {campaign?.smsroute?.name}
                          </Link>{" "}
                          {campaign?.status === "sending"
                            ? campaign?.smsroute?.defaultsendspeed + "T/S"
                            : null}
                        </td>

                        <td style={{ fontWeight: 100, marginRight: 10 }}>
                          {moment(campaign?.date).format("MM/DD/YYYY")}
                        </td>

                        <td
                          style={{
                            fontWeight: 1000,
                            color:
                              campaign?.status === "scheduled"
                                ? "gold"
                                : campaign?.status === "processing"
                                ? "purple"
                                : campaign?.status === "deleting" ||
                                  campaign?.status === "aborted"
                                ? "crimson"
                                : campaign?.status === "sending"
                                ? "blue"
                                : "lightgreen",
                          }}
                        >
                          {campaign?.status}{" "}
                          {campaign?.status === "processing" &&
                          campaign?.uploadCount ? (
                            <span>
                              {(
                                (campaign?.totalProcessed /
                                  (campaign?.uploadCount -
                                    campaign?.infileduplicates || 0)) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          ) : null}
                        </td>

                        <td className={classes.DeleteCont}>
                          {campaign?.status !== "sending" &&
                          campaign?.status !== "paused" ? null : (
                            <FontAwesomeIcon
                              style={{ marginRight: 10 }}
                              icon={faStop}
                              title="Abort Campaign"
                              onClick={() => {
                                setselectedlead(campaign);
                                setabortmodalshowing(true);
                              }}
                            />
                          )}
                          {campaign?.status !== "sending" &&
                          campaign?.status !== "paused" ? null : (
                            <FontAwesomeIcon
                              icon={
                                campaign?.status === "sending"
                                  ? faPause
                                  : faPlay
                              }
                              title={
                                campaign?.status === "sending"
                                  ? "Pause Campaign"
                                  : campaign?.status === "paused"
                                  ? "Resume Campaign"
                                  : ""
                              }
                              style={{ color: "greenyellow", marginRight: 10 }}
                              onClick={() => {
                                setselectedlead(campaign);

                                if (campaign?.status === "sending") {
                                  pauseplaycampaign("pause", campaign);
                                } else if (campaign?.status === "paused") {
                                  pauseplaycampaign("resume", campaign);
                                }
                              }}
                            />
                          )}
                          <FontAwesomeIcon
                            icon={faTrash}
                            title="Delete Campaign"
                            style={{ color: "red", marginRight: 10 }}
                            onClick={() => {
                              setselectedlead(campaign);
                              setabortmodalshowing(true);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </table>

              <br></br>
            </div>
          ) : null}
        </div>
        <div className={classes.loadmorecont}>
          {nomoreresults ? (
            <p style={{ textAlign: "center", fontWeight: 100 }}>
              End of results
            </p>
          ) : !nomoreresults && campaigns.length > 0 ? (
            <button
              disabled={isfetching}
              onClick={() => setfetchvalue("campaigns", page + 1)}
              className={classes.loadmore}
            >
              Load More
            </button>
          ) : null}
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

export default Campaigns;

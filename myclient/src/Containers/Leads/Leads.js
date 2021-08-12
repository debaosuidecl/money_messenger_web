// @ts-nocheck

import {
  faInfoCircle,
  faPlusCircle,
  faSyncAlt,
  faTrashAlt,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./Leads.module.css";
import socketIOClient from "socket.io-client";
import FilterCont from "./FilterCont";
import MyModal from "../../Component/MyModal/MyModal";
import Info from "./Info";
import MyInput from "../../Component/Input/Input";

function Leads({ history }) {
  const [loading, setloading] = useState(true);
  const [leads, setleads] = useState([]);
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [selectedlead, setselectedlead] = useState(null);
  const [infopanel, setinfopanel] = useState(null);
  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/
  useEffect(() => {
    const _socket1 = socketIOClient(GLOBAL.uploadlead1);

    [_socket1].forEach((_s) => {
      _s.on("updatescrub", (_group) => {
        console.log(_group);
        setleads((myleads) =>
          [...myleads].map((l) => {
            if (l._id === _group._id) {
              return _group;
            }

            return l;
          })
        );
      });
    });

    getLeads();
  }, []);

  const searchvaluechangehandler = async (e, option) => {
    setsearchvalue(e.target.value);
    setnomoreresults(false);

    setpage(0);

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}/fuzzy-search?value=${e.target.value}&removenonetraffic=true&page=${page}`,
        null,
        true
      );

      console.log(data);
      setpage(0);

      if (data.length === 0) {
        // setnomoreresults(true);&removenonetraffic=true
        setleads([]);
      } else
        setleads((prev) => {
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
        `${GLOBAL.domainMain}/api/${option}?page=${newpage}&searchvalue=${searchvalue}&campaigncreation=1`,
        null,
        true
      );

      console.log(data);
      if (data.length === 0) {
        setnomoreresults(true);
      }

      setleads((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  const getLeads = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/leads`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      setleads(data);
      setloading(false);
    } catch (error) {
      console.log(error?.response?.data?.errors || []);

      setloading(false);

      seterrors(error?.response?.data?.errors || []); // must be an array;
    }
  };

  const deleteLeadGroup = async () => {
    // clearErrors();
    seterrors([]);
    try {
      const res = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/leads/delete/${selectedlead?._id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);

      getLeads();
      // setleads(data);
      setsuccesses([
        {
          msg: "Successfully delete " + selectedlead.friendlyname,
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
      <p style={{ color: "red", fontWeight: 300 }}>
        Are you sure you want to delete {selectedlead?.friendlyname}?
      </p>
      <p style={{ fontWeight: 300 }}>
        If a campaign is using this dataset, it may lead to disruption in the
        campaign
      </p>

      <br />

      <div className={classes.ButtonCont}>
        <button
          onClick={() => deleteLeadGroup()}
          className={[classes.Option, classes.Red].join(" ")}
        >
          Yes
        </button>
        <button
          onClick={() => setdeletemodalshowing(false)}
          style={{ background: "black" }}
          className={[classes.Option, classes.black].join(" ")}
        >
          No
        </button>
      </div>
    </MyModal>
  );
  return (
    <Layout>
      {deleteModal}
      <Info show={infopanel != null} handleClose={() => setinfopanel(null)}>
        {infopanel}
      </Info>
      <div className={classes.LEADS}>
        <Routes
          style={{ maxWidth: 1400 }}
          routeList={[
            {
              name: "Home",
              link: "/",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>My lead groups</h1>
          </div>

          <div className={classes.Flex}>
            {/* <div
              onClick={() => {
                history.push(`/leads`);
              }}
              className=""
              style={{ marginRight: 20, cursor: "pointer" }}
            >
              Add Lead(s) to Blacklist{" "}
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faPlusCircle}
              />
            </div> */}
            <div
              onClick={() => {
                history.push(`/leads/create/step1`);
              }}
              className=""
              style={{ marginRight: 20, cursor: "pointer" }}
            >
              Upload{" "}
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
                  getLeads();
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
              placeholder="Search for your Leads ..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "leads")}
            />
          </div>
          {loading ? (
            <div className={classes.LoadingBody}>
              <MySkeletonLoader />
            </div>
          ) : leads.length <= 0 && !loading ? (
            <div className={classes.LoadingBody}>
              <div className={classes.Container}>
                <div className={classes.InputCont}>
                  {leads.length <= 0 ? (
                    <div className={classes.NoPhoneNumbers}>
                      <h2 style={{ fontWeight: 300 }}>
                        No Lead Groups Created.
                      </h2>
                      <br />
                      <button
                        onClick={() => history.push(`/leads/create/step1`)}
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
          {leads.length <= 0 && !loading ? null : <FilterCont />}

          {!loading && leads && leads.length > 0 ? (
            <div className={classes.Container2}>
              <div className={classes["search-table-outter"]}>
                <table className={classes["search-table"]}>
                  <tr>
                    <th>Lead Group Name</th>
                    <th>Original file name</th>
                    <th>Total Uploaded</th>
                    <th>
                      Total Processed{" "}
                      <FontAwesomeIcon
                        onClick={() => {
                          console.log("me");
                          setinfopanel(
                            "There may be discrepancies between the Total Processed Value and Total Upload. This is may be due to infile duplicates present in your uplaoded file"
                          );
                        }}
                        icon={faInfoCircle}
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                    <th>Total Duplicates</th>
                    <th>Carrier Details</th>
                    <th>Total Infile duplicates</th>
                    <th>Upload date</th>
                    <th>Status</th>
                    <th>Group Action</th>
                  </tr>

                  {leads &&
                    leads.map((lead) => {
                      return (
                        <tr className={classes.LeadGroup} key={lead._id}>
                          <td style={{ fontWeight: 300 }}>
                            {lead?.friendlyname}
                          </td>
                          <td style={{ fontWeight: 300 }}>
                            {lead?.originalname}
                          </td>

                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            {lead?.uploadCount}
                          </td>

                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            {lead?.totalProcessed}
                          </td>
                      
                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            {lead?.globalduplicates}
                          </td>
                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            <strong>METRO</strong>: {lead?.METRO || 0}<br></br> 
                            <strong>AT{"&"}T:</strong> {lead?.ATT || 0}  <br></br>
                            <strong>VERIZON:</strong> {lead?.VERIZON || 0}  <br></br>
                            <strong>SPRINT:</strong> {lead?.SPRINT || 0}  <br></br>
                            <strong>TMOBILE:</strong> {lead?.TMOBILE || 0} <br></br>
                            <strong>US Cellular:</strong> {lead?.USCellular || 0} <br></br>
                            <strong>Landlines:</strong> {lead?.landline || 0} <br></br>
                            <strong style={{color: "red"}}>Blacklist:</strong> {lead?.blacklist || 0} <br></br>
                          </td>
                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            {lead?.infileduplicates}
                          </td>

                          <td style={{ fontWeight: 300, marginRight: 10 }}>
                            {moment(lead?.date).format("MM/DD/YYYY")}
                          </td>

                          <td
                            style={{
                              fontWeight: 3000,
                              color:
                                lead?.status === "scheduled"
                                  ? "gold"
                                  : lead?.status === "processing"
                                  ? "purple"
                                  : lead?.status === "deleting"
                                  ? "crimson"
                                  : "lightgreen",
                            }}
                          >
                            {lead?.status}{" "}
                            {lead?.status === "processing" &&
                            lead?.uploadCount ? (
                              <span>
                                {(
                                  (lead?.totalProcessed /
                                    (lead?.uploadCount -
                                      lead?.infileduplicates || 0)) *
                                  100
                                ).toFixed(2)}
                                %
                              </span>
                            ) : null}
                          </td>

                          <td className={classes.DeleteCont}>
                            {lead?.status === "processing"? 
                            
                            <>
                            <span style={{fontWeight: 300, color: "red"}}>Stop</span> {" "}
                            <FontAwesomeIcon
                              icon={faStopCircle}
                              onClick={() => {
                                setselectedlead(lead);
                                setdeletemodalshowing(true);
                              }}
                            />
                            </>
                            : <p style={{fontWeight: 300}}>No Action</p>}
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </div>
              <div className={classes.loadmorecont}>
                {nomoreresults ? (
                  <p style={{ textAlign: "center", fontWeight: 300 }}>
                    End of results
                  </p>
                ) : !nomoreresults && leads.length > 0 ? (
                  <button
                    disabled={isfetching}
                    onClick={() => setfetchvalue("leads", page + 1)}
                    className={classes.loadmore}
                  >
                    Load More
                  </button>
                ) : null}
              </div>
            </div>
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

export default Leads;

// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./SMSROUTES.module.css";
import {
  FontAwesomeIcon as F,
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import SingleSMSROUTE from "./SingleSMSROUTE";
import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import OptionsModal from "./OptionsModal";
import MySelect from "../../Component/MySelect/MySelect";
function SMSROUTES() {
  const [smsroutelist, setsmsrouteslist] = useState([]);
  const [loading, setloading] = useState(true);
  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [errors, seterrors] = useState([]);
  const [editname, seteditname] = useState("");
  const [editid, seteditid] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [successes, setsuccesses] = useState([]);
  const [showingoptions, setshowingoptions] = useState(false);
  const [selectedsmsroute, setselectedsmsroute] = useState(null);
  const [username, setusername] = useState("");
  const [port, setport] = useState("");
  const [password, setpassword] = useState("");
  const [endpoint, setendpoint] = useState("");
  const [bindtype, setbindtype] = useState("");
  const [routetype, setroutetype] = useState("");
  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/
  useEffect(() => {
    fetchsmsroutes();
  }, []);

  const fetchsmsroutes = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/smsroutes`,
        null,
        true
      );
      console.log(res);
      setsmsrouteslist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const clearErrors = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

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
        setsmsrouteslist([]);
      } else
        setsmsrouteslist((prev) => {
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

      setsmsrouteslist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  const clearSuccesses = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };
  const smsroute_crud = async (isDeleting) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/smsroutes/${
          editMode && !isDeleting
            ? `edit/${editid}`
            : isDeleting
            ? `delete/${editid}`
            : `create-${routetype.toLowerCase()}`
        }`,
        {
          name: editname,
          routetype,
          username,
          password,
          endpoint,
          bindtype,
          port,
        },
        true
      );

      console.log(data);

      if (!data.user) {
        return setloading(false);
      }

      seteditmodalshowing(false);
      setEditMode(false);
      seteditid("");
      setdeletemodalshowing(false);

      if (editMode && !isDeleting) {
        let copieddataownerlist = [...smsroutelist];

        copieddataownerlist = copieddataownerlist.map((dataowner) => {
          if (dataowner._id === data._id) {
            return {
              ...dataowner,
              name: data.name,
            };
          }

          return dataowner;
        });

        setsmsrouteslist(copieddataownerlist);
        setsuccesses([
          {
            msg: "SMS rOUTE edited!",
          },
        ]);
      } else if (editMode && isDeleting) {
        let copieddataownerlist = [...smsroutelist];

        copieddataownerlist = copieddataownerlist.filter((dataowner) => {
          return dataowner._id !== data._id;
        });

        setsmsrouteslist(copieddataownerlist);
        setsuccesses([
          {
            msg: "SMS ROUTE deleted!",
          },
        ]);
      } else {
        setsmsrouteslist((prev) => [data, ...prev]);
        setsuccesses([
          {
            msg: "SMS ROUTE added!",
          },
        ]);
      }

      clearSuccesses();
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };

  const disableenabler = () => {
    if (!routetype || (routetype !== "SMPP" && routetype !== "API")) {
      return true;
    }
    if (routetype === "SMPP") {
      if (!endpoint || !editname || !username || !password || !bindtype) {
        return true;
      } else {
        return false;
      }
    }

    if (routetype === "API") {
      if (!editname) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };
  const createRouteModal = (
    <MyModal
      open={editmodalshowing}
      maxWidth="600px"
      handleClose={() => {
        seteditmodalshowing(false);
        setEditMode(false);
        seteditid("");
        seteditname("");
      }}
    >
      <MyModal
        open={deletemodalshowing}
        handleClose={() => {
          setdeletemodalshowing(false);
        }}
        maxWidth="500px"
      >
        <h3 style={{ color: "red", fontWeight: 400 }}>
          Are you sure delete this SMS Route?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may cause previous campaigns with data provided by this supplier
          to display: Deleted Supplier
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() => smsroute_crud(true)}
            className={[classes.Option, classes.Red].join(" ")}
          >
            Yes
          </button>
          <button
            onClick={() => setdeletemodalshowing(false)}
            className={[classes.Option, classes.black].join(" ")}
          >
            No
          </button>
        </div>
      </MyModal>
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>
          {editMode ? "Edit SMS Route" : "Add SMS Route"}
        </h4>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="SMS Route Name"
          placeholder="eg: Message Bird"
        />
        <br></br>

        <MySelect
          label="Route Type"
          value={routetype}
          onChange={(e) => {
            setroutetype(e.target.value);
          }}
        >
          <option value="">-- Select Route Type --</option>
          <option value="API">API</option>
          <option value="SMPP">SMPP (Recommended)</option>
        </MySelect>

        {routetype === "SMPP" ? (
          <div>
            <br></br>
            <MyInput
              value={endpoint}
              onChange={(e) => setendpoint(e.target.value)}
              label="END POINT IP"
              placeholder="eg: 0.0.0.0.0"
            />
            <br></br>
            <MyInput
              value={port}
              onChange={(e) => setport(e.target.value)}
              label="PORT"
              placeholder="eg: 3000"
            />
            <br></br>

            <MyInput
              value={username}
              onChange={(e) => setusername(e.target.value)}
              label="SMPP User Name"
              placeholder="Enter SMPP user name"
            />

            <br></br>
            <MyInput
              value={password}
              type="password"
              onChange={(e) => setpassword(e.target.value)}
              label="SMPP Password"
              placeholder=" Enter SMPP Password"
            />
            <br></br>
            <MySelect
              label="Select  Bindtype"
              value={bindtype}
              onChange={(e) => {
                setbindtype(e.target.value);
              }}
            >
              <option value="">-- Select Bind Type --</option>
              <option value="transceiver">Transceiver</option>
              <option value="transmitter">Transmitter</option>
            </MySelect>
            <br></br>
          </div>
        ) : null}
        <br></br>

        <div className={classes.ButtonCont2}>
          <Button
            onClick={() => smsroute_crud()}
            className={classes.buttonClass}
            variant="contained"
            color="primary"
            disabled={disableenabler()}
            style={{ background: "black", width: "100%", color: "white" }}
          >
            {editMode ? "Edit SMS Route" : "Add SMS Route"}
          </Button>
        </div>

        {editMode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
              disabled={disableenabler()}
              variant="contained"
              color="secondary"
              style={{ backgroundColor: "black", width: "100%" }}
            >
              Delete SMS Route <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  return (
    <Layout>
      <OptionsModal
        handleClose={() => setshowingoptions(false)}
        open={showingoptions}
        selectedsmsroute={selectedsmsroute}
      />
      <div className={classes.SMSROUTE}>
        {createRouteModal}
        <Routes
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
            <h1>My SMS ROUTES</h1>
          </div>

          <div
            onClick={() => seteditmodalshowing(true)}
            className={classes.createButton}
          >
            <Link>Create SMS Route</Link>
            <F icon={faPlusCircle} />
          </div>
        </div>

        <div className={classes.Container2}>
          <MyInput
            placeholder="Search for your SMS Routes..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "smsroutes")}
          />
        </div>

        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : smsroutelist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="360px" alt="" />

            <p>You have not created any SMSROUTES yet :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {/* <MyInput
              placeholder="Search for your Domain Groups..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "smsroutes")}
            /> */}
            {smsroutelist &&
              smsroutelist.map((smsroute, i) => {
                return (
                  <SingleSMSROUTE
                    key={i}
                    smsroute={smsroute}
                    showoptions={() => {
                      setselectedsmsroute(smsroute);
                      setshowingoptions(true);
                    }}
                  />
                );
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && smsroutelist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("smsroutes", page + 1)}
                  className={classes.loadmore}
                >
                  Load More
                </button>
              ) : null}
            </div>
          </div>
        )}
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

export default SMSROUTES;

// @ts-nocheck
import {
  faEye,
  faEyeSlash,
  faPen,
  faPlusCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
// import Layout from "../../Component/Layout/Layout";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./SMSROUTE.module.css";
import { Button } from "@material-ui/core";

import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import TestComponent from "./TestComponent";
function SMSROUTE() {
  //   const [errors, seterrors] = useState([]);
  const [loading, setloading] = useState(true);
  const [name, setname] = useState("");

  // const [_, setvariables] = useState([]);
  const [smsauthusername, setsmsauthusername] = useState("");
  const [smsauthpassword, setsmsauthpassword] = useState("");
  const [editmode, seteditmode] = useState(false);
  const [smsurl, setsmsurl] = useState("");
  const [smsmethod, setsmsmethod] = useState("");
  const [input1, setinput1] = useState("");
  const [headers, setheaders] = useState([]);
  const [postbody, setpostbody] = useState([]);
  const [input2, setinput2] = useState("");

  const [urlmodalshowing, seturlmodalshowing] = useState(false);
  const [addauthmodalshowing, setaddauthmodalshowing] = useState(false);
  const [addheadermodalshowing, setaddheadermodalshowing] = useState(false);
  const [addpostbodymodalshowing, setaddpostbodymodalshowing] = useState(false);
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [istestsending, setistestsending] = useState(false);

  const [testmodalopen, settestmodalopen] = useState(false);
  const [deleteroutemodal, setdeleteroutemodal] = useState(false);

  const [hideusername, togglehideusername] = useState(true);
  const [hidepassword, togglehidepassword] = useState(true);
  const [testresult, settestresult] = useState("");
  const [smsspeed, setsmsspeed] = useState(100);
  const [showingspeedmodal, setshowingspeedmodal] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    getSMSROUTE(id);
  }, []);

  const handleRouteTest = async ({ fromphone, tophone, message }) => {
    console.log(
      fromphone,
      tophone,
      smsurl,
      headers,
      postbody,
      smsmethod,
      id,
      message
    );
    // return;

    setistestsending(true);

    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/smsroutes/test-sms-route/${id}`,
        {
          fromphone,
          tophone,
          smsurl,
          headers,
          postbody,
          smsmethod,
          message,
        },

        true
      );

      console.log(data);

      setistestsending(false);

      settestresult(JSON.stringify({ data }));
    } catch (error) {
      setistestsending(false);

      console.log(error);
      seterrors(error?.response?.data?.errors || []);
      clearErrors();
    }
  };

  const getSMSROUTE = async (id) => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/smsroutes/single/${id}`,
        null,
        true
      );
      console.log(res);
      const data = res.data;
      console.log(data);
      if (!data.user) {
        return setloading(false);
      }
      setname(data.name);
      setloading(false);

      setsmsurl(data.sendsmsurl || "");
      setsmsmethod(data.sendsmsmethod || "");
      setheaders(data.smsheaders || []);
      setsmsauthusername(data.smsauthusername || "");
      setsmsauthpassword(data.smsauthpassword || "");
      setsmsspeed(data.defaultsendspeed || 100);
      setpostbody(data.postbody || []);
      // setvariables(data.variables || []);
    } catch (error) {
      console.log(error.response.data);

      setloading(false);

      seterrors(error.response.data); // must be an array;
    }
  };

  const smsroutecrud = async ({
    seturl,
    addauth,
    editauth,
    deleteauth,
    addpostbodyitem,
    editpostbodyitem,
    deletepostbodyitem,
    addheader,
    editheader,
    setspeed,
    deleteroute,
    deleteheader,
  }) => {
    try {
      let urlcrud = `${GLOBAL.domainMain}/api/smsroutes/edit-sms-route/${
        seturl
          ? "url"
          : addheader
          ? "header"
          : editheader
          ? "edit-header"
          : deleteheader
          ? "delete-header"
          : addpostbodyitem
          ? "postbody"
          : editpostbodyitem
          ? "edit-postbody"
          : deletepostbodyitem
          ? "delete-postbody"
          : addauth
          ? "auth"
          : editauth
          ? "auth"
          : deleteauth
          ? "delete-auth"
          : setspeed
          ? "setspeed"
          : null
      }/${id}`;

      if (deleteroute) {
        urlcrud = `${GLOBAL.domainMain}/api/smsroutes/delete/${id}`;
      }
      const { data } = await REQ(
        "post",
        urlcrud,
        seturl
          ? {
              sendsmsurl: input1,
              sendsmsmethod: input2,
            }
          : addheader ||
            editheader ||
            deleteheader ||
            addpostbodyitem ||
            editpostbodyitem ||
            deletepostbodyitem ||
            addauth ||
            editauth ||
            deleteauth
          ? {
              key: input1,
              value: input2,
              id: editmode,
            }
          : setspeed
          ? {
              speed: input1,
            }
          : null,
        true
      );

      console.log(data);
      if (deleteroute) {
        window.location.href = "/sms-routes";

        return;
      }
      if (!data.user) {
        return setloading(false);
      }

      if (seturl) {
        setsmsurl(data.sendsmsurl);
        setsmsmethod(data.sendsmsmethod);
        setsuccesses([
          {
            msg: "SMS URL SET SUCCESSFULLY",
          },
        ]);
        seturlmodalshowing(false);
      }
      if (setspeed) {
        setsmsspeed(data.defaultsendspeed);
        // setsmsmethod(data.sendsmsmethod);
        setsuccesses([
          {
            msg: "SMS SPEED SET SUCCESSFULLY",
          },
        ]);
        setshowingspeedmodal(false);
      }

      if (addheader || editheader || deleteheader) {
        setheaders(data.smsheaders || []);
        setsuccesses([
          {
            msg: editheader
              ? "HEADER EDITED SUCCESSFULLY"
              : deleteheader
              ? "HEADER DELETED SUCCESSFULLY"
              : "HEADER ADDED SUCCESSFULLY",
          },
        ]);
        setdeletemodalshowing(false);
        setaddheadermodalshowing(false);
      }
      if (addpostbodyitem || editpostbodyitem || deletepostbodyitem) {
        setpostbody(data.postbody || []);
        setsuccesses([
          {
            msg: editpostbodyitem
              ? "POST BODY ITEM EDITED SUCCESSFULLY"
              : deletepostbodyitem
              ? "POST BODY ITEM DELETED SUCCESSFULLY"
              : "POST BDDY ITEM ADDED SUCCESSFULLY",
          },
        ]);
        setdeletemodalshowing(false);
        setaddheadermodalshowing(false);
        setaddpostbodymodalshowing(false);
      }
      if (addauth || editauth || deleteauth) {
        setsmsauthusername(data.smsauthusername || "");
        setsmsauthpassword(data.smsauthpassword || "");
        setsuccesses([
          {
            msg: editauth
              ? "Auth Credentials EDITED SUCCESSFULLY"
              : deleteauth
              ? "Auth Credentials DELETED SUCCESSFULLY"
              : "Auth Creditials ADDED SUCCESSFULLY",
          },
        ]);
        setdeletemodalshowing(false);
        setaddauthmodalshowing(false);
        setaddpostbodymodalshowing(false);
      }

      setinput1("");
      setinput2("");
      clearSuccesses();
      seteditmode("");
    } catch (error) {
      console.log(error);
      seterrors(error?.response?.data?.errors || []);
      clearErrors();
    }
  };

  const setspeedmodal = (
    <MyModal
      open={showingspeedmodal}
      maxWidth="600px"
      handleClose={() => {
        setshowingspeedmodal(false);
        setinput1("");
      }}
    >
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>Set SMS TPS</h4>
        <br></br>
        <MyInput
          value={input1}
          type="number"
          onChange={(e) => setinput1(e.target.value)}
          label="SMS SPEED (TPS)"
          placeholder="Enter SMS SPEED IN TPS"
        />
        <br></br>

        <p style={{ color: "red", fontWeight: 100 }}>
          **Be very careful how you set the TPS. If the route is active on a
          campaign, it takes about 50 seconds to apply. only click "SET SPEED"
          if you are sure of the accurate speed according to the documentation
          of your SMS Route Provider and number of route phone numbers in
          rotation.**
        </p>

        <br />
        <div className={classes.ButtonCont}>
          <Button
            onClick={() =>
              smsroutecrud({
                setspeed: true,
              })
            }
            className={classes.buttonClass}
          >
            SET SPEED
          </Button>
        </div>
      </div>
    </MyModal>
  );
  const seturlmodal = (
    <MyModal
      open={urlmodalshowing}
      maxWidth="600px"
      handleClose={() => {
        seturlmodalshowing(false);
        setinput1("");
      }}
    >
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>Set SMS URL</h4>
        <br></br>
        <MyInput
          value={input1}
          onChange={(e) => setinput1(e.target.value)}
          label="SMS URL"
          placeholder="eg: http://smssendingapi.com/send-sms?from={from_phone}..."
        />
        <br></br>

        <br></br>
        <div className={classes.SelectCont}>
          <label htmlFor="">Request method</label>
          <select
            value={input2}
            onChange={(e) => setinput2(e.target.value)}
            name=""
            id=""
          >
            <option value="">-- SELECT AN REQUEST METHOD</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <br />
        <div className={classes.ButtonCont}>
          <Button
            onClick={() =>
              smsroutecrud({
                seturl: true,
              })
            }
            className={classes.buttonClass}
          >
            SET URL
          </Button>
        </div>
      </div>
    </MyModal>
  );
  const addauthmodal = (
    <MyModal
      open={addauthmodalshowing}
      maxWidth="600px"
      handleClose={() => {
        setaddauthmodalshowing(false);
        setinput1("");
        setinput2("");
        setdeletemodalshowing(false);
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
          Are you sure delete this Auth?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may take a while to adjust for your current campaigns
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() =>
              smsroutecrud({
                deleteauth: true,
              })
            }
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
        {editmode ? (
          <h4 style={{ color: "#222", fontWeight: 100 }}>
            Edit API auth credentials{" "}
          </h4>
        ) : (
          <h4 style={{ color: "#222", fontWeight: 100 }}>
            Create API auth credentials
          </h4>
        )}
        <br></br>
        <MyInput
          value={input1}
          onChange={(e) => setinput1(e.target.value)}
          label="User"
          placeholder="eg: username"
        />
        <br></br>
        <MyInput
          value={input2}
          onChange={(e) => setinput2(e.target.value)}
          label="Password"
          placeholder="eg: api password"
        />
        <br />
        <div className={classes.ButtonCont}>
          {editmode ? (
            <Button
              onClick={() =>
                smsroutecrud({
                  editauth: true,
                })
              }
              className={classes.buttonClass}
            >
              Edit Auth
            </Button>
          ) : (
            <Button
              onClick={() =>
                smsroutecrud({
                  addauth: true,
                })
              }
              className={classes.buttonClass}
            >
              Create Auth
            </Button>
          )}
        </div>
      </div>
      {editmode ? (
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => setdeletemodalshowing(true)}
            className={[classes.buttonClass2].join(" ")}
          >
            Delete Auth <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </div>
      ) : null}
    </MyModal>
  );
  const addheadermodal = (
    <MyModal
      open={addheadermodalshowing}
      maxWidth="600px"
      handleClose={() => {
        setaddheadermodalshowing(false);
        setinput1("");
        setinput2("");
        seteditmode(false);
        setdeletemodalshowing(false);
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
          Are you sure delete this Header?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may take a while to adjust for your current campaigns
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() =>
              smsroutecrud({
                deleteheader: true,
              })
            }
            // onClick={() => dataowner_CRUD(true)}
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
        {editmode ? (
          <h4 style={{ color: "#222", fontWeight: 100 }}>Edit Header</h4>
        ) : (
          <h4 style={{ color: "#222", fontWeight: 100 }}>Add a Header</h4>
        )}
        <br></br>
        <MyInput
          value={input1}
          onChange={(e) => setinput1(e.target.value)}
          label="Header Key"
          placeholder="eg: x-auth-username"
        />
        <br></br>
        <MyInput
          value={input2}
          onChange={(e) => setinput2(e.target.value)}
          label="Header Value"
          placeholder="eg: auth_username"
        />
        <br />
        <div className={classes.ButtonCont}>
          {editmode ? (
            <Button
              onClick={() =>
                smsroutecrud({
                  editheader: true,
                })
              }
              className={classes.buttonClass}
            >
              Edit Header
            </Button>
          ) : (
            <Button
              onClick={() =>
                smsroutecrud({
                  addheader: true,
                })
              }
              className={classes.buttonClass}
            >
              Add Header
            </Button>
          )}
        </div>

        {editmode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
            >
              Delete Header <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  const addpostbodymodal = (
    <MyModal
      open={addpostbodymodalshowing}
      maxWidth="600px"
      handleClose={() => {
        setaddpostbodymodalshowing(false);
        setdeletemodalshowing(false);
        setinput1("");
        setinput2("");
        seteditmode("");
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
          Are you sure delete this Post body item?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may take a while to adjust for your current campaigns
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() =>
              smsroutecrud({
                deletepostbodyitem: true,
              })
            }
            // onClick={() => dataowner_CRUD(true)}
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
        {editmode ? (
          <h4 style={{ color: "#222", fontWeight: 100 }}>
            {" "}
            Edit Post Body Item
          </h4>
        ) : (
          <h4 style={{ color: "#222", fontWeight: 100 }}>
            Add a Post Body Item
          </h4>
        )}
        <br></br>
        <MyInput
          value={input1}
          onChange={(e) => setinput1(e.target.value)}
          label="Post body Item Key"
          placeholder="eg: from"
        />
        <br></br>
        <MyInput
          value={input2}
          onChange={(e) => setinput2(e.target.value)}
          label="Post body Item Value"
          placeholder=""
        />
        <br />
        <div className={classes.ButtonCont}>
          {editmode ? (
            <Button
              onClick={() =>
                smsroutecrud({
                  editpostbodyitem: true,
                })
              }
              className={classes.buttonClass}
            >
              Edit post body Item
            </Button>
          ) : (
            <Button
              onClick={() =>
                smsroutecrud({
                  addpostbodyitem: true,
                })
              }
              className={classes.buttonClass}
            >
              Add Post body item
            </Button>
          )}
        </div>
        {editmode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
            >
              Delete <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  const deletemodalstructure = (
    <MyModal
      open={deleteroutemodal}
      handleClose={() => {
        setdeleteroutemodal(false);
      }}
      maxWidth="500px"
    >
      <h3 style={{ color: "red", fontWeight: 400 }}>
        Are you sure delete This Route?
      </h3>
      <p style={{ fontWeight: 100 }}>
        This will lead to the abrupt halting of any campaigns using this route
      </p>

      <br />

      <div className={classes.ButtonCont}>
        <button
          onClick={() =>
            smsroutecrud({
              deleteroute: true,
            })
          }
          // onClick={() => dataowner_CRUD(true)}
          className={[classes.Option, classes.Red].join(" ")}
        >
          Yes
        </button>
        <button
          onClick={() => setdeleteroutemodal(false)}
          className={[classes.Option, classes.black].join(" ")}
        >
          No
        </button>
      </div>
    </MyModal>
  );
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
    <div>
      {addauthmodal}
      {seturlmodal}
      {addheadermodal}
      {setspeedmodal}
      {addpostbodymodal}
      {deletemodalstructure}
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
            <h1>Route Name: {name}</h1>
            {/* <button></button> */}
          </div>
        </div>

        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : (
            <div className={classes.SMSROUTEDETAILS}>
              <p className={classes.TPS} style={{ textAlign: "left" }}>
                <span className={classes.credtitle}>Route type</span>
                {"  "}
                API
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              {/* Variables  */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "orange" }}>Variables</span>
                </div>
              </div>
              <div className={classes.HeaderList}>
                <div className={classes.ItemInLine}>{"{from_phone}"}</div>
                <div className={classes.ItemInLine}>{"{to_phone}"}</div>
                <div className={classes.ItemInLine}>{"{message}"}</div>
              </div>

              <br />
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

              {/* SET SPEED  */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "darkblue" }}>
                    Number of texts per second(TPS)
                  </span>
                </div>
              </div>
              <div className={classes.ButtonEdit}>
                <p className={classes.TPS}>{smsspeed} Texts/second</p>
                <button
                  onClick={() => {
                    setinput1(smsspeed);
                    setinput2("");
                    setshowingspeedmodal(true);
                  }}
                >
                  EDIT TPS <FontAwesomeIcon icon={faPen} />
                </button>
              </div>

              <br />
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              {/* URL SECTION */}

              <div className={classes.SMSURLSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "lightgreen" }}>SMS URL</span>
                </div>
                {smsurl ? (
                  <button
                    onClick={() => {
                      setinput1(smsurl);
                      setinput2(smsmethod);
                      seturlmodalshowing(true);
                    }}
                  >
                    EDIT SMS URL <FontAwesomeIcon icon={faPen} />
                  </button>
                ) : (
                  <button onClick={() => seturlmodalshowing(true)}>
                    Add SMS URL <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                )}
              </div>
              {smsurl ? (
                <p style={{ textAlign: "left" }}>
                  <span
                    style={{
                      padding: "2px 5px",
                      background: smsmethod === "GET" ? "lightgreen" : "indigo",
                    }}
                  >
                    {smsmethod}
                  </span>
                  {smsurl}
                </p>
              ) : (
                <p style={{ textAlign: "left" }}>
                  You have No SMS URL on this route
                </p>
              )}
              <br />
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              {/* HEADERS */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "gold" }}>SMS Headers</span>
                </div>
                <button onClick={() => setaddheadermodalshowing(true)}>
                  Add an SMS Header <FontAwesomeIcon icon={faPlusCircle} />
                </button>
              </div>
              <ul className={classes.HeaderList}>
                {headers.length <= 0 ? (
                  <p style={{ textAlign: "left" }}>
                    You have No headers on this route
                  </p>
                ) : (
                  headers &&
                  headers.map((headeritem, i) => {
                    return (
                      <li
                        onClick={() => {
                          seteditmode(headeritem._id);
                          setinput1(headeritem.key);
                          setinput2(headeritem.value);
                          setaddheadermodalshowing(true);
                        }}
                        className={classes.HeaderItem}
                      >
                        <p>
                          <FontAwesomeIcon icon={faPen} color="#222" />{" "}
                          <strong>{headeritem.key}</strong>: {headeritem.value}
                        </p>
                      </li>
                    );
                  })
                )}
              </ul>

              <br />
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

              {/* AUTH */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "crimson" }}>Auth</span>
                </div>
                {!smsauthusername || !smsauthpassword ? (
                  <button onClick={() => setaddauthmodalshowing(true)}>
                    Add an SMS AUTH <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setinput1(smsauthusername);
                      setinput2(smsauthpassword);
                      seteditmode("editme");
                      setaddauthmodalshowing(true);
                    }}
                  >
                    Edit SMS AUTH <FontAwesomeIcon icon={faPlusCircle} />
                  </button>
                )}
              </div>
              <ul className={classes.HeaderList}>
                {!smsauthusername || !smsauthpassword ? (
                  <p style={{ textAlign: "left" }}>
                    You have No Auth Credentials on this route
                  </p>
                ) : (
                  <>
                    <li className={classes.HeaderItem}>
                      <p>
                        <strong>username</strong>:{" "}
                        {hideusername ? "********" : smsauthusername}{" "}
                        <FontAwesomeIcon
                          onClick={() =>
                            togglehideusername((prevstate) => !prevstate)
                          }
                          icon={hideusername ? faEyeSlash : faEye}
                        />
                      </p>
                    </li>
                    <li onClick={() => {}} className={classes.HeaderItem}>
                      <p>
                        <strong>password</strong>:{" "}
                        {hidepassword ? "*******" : smsauthpassword}{" "}
                        <FontAwesomeIcon
                          onClick={() =>
                            togglehidepassword((prevstate) => !prevstate)
                          }
                          icon={hidepassword ? faEyeSlash : faEye}
                        />
                      </p>
                    </li>
                  </>
                )}
              </ul>

              <br />
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
              {/* DATA BODY  */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "purple" }}>Post Body</span>
                </div>
                <button onClick={() => setaddpostbodymodalshowing(true)}>
                  Add Post Body <FontAwesomeIcon icon={faPlusCircle} />
                </button>
              </div>
              <ul className={classes.HeaderList}>
                {postbody.length <= 0 ? (
                  <p style={{ textAlign: "left" }}>
                    You have No postbody on this route
                  </p>
                ) : (
                  postbody &&
                  postbody.map((postbodyitem, i) => {
                    return (
                      <li
                        onClick={() => {
                          seteditmode(postbodyitem._id);
                          setinput1(postbodyitem.key);
                          setinput2(postbodyitem.value);
                          setaddpostbodymodalshowing(true);
                        }}
                        className={classes.HeaderItem}
                      >
                        <p>
                          <FontAwesomeIcon icon={faPen} color="#222" />{" "}
                          <strong>{postbodyitem.key}</strong>:{" "}
                          {postbodyitem.value}
                        </p>
                      </li>
                    );
                  })
                )}
              </ul>

              <br />
            </div>
          )}
          <div className={classes.ButtonCont}>
            <button
              onClick={() => settestmodalopen(true)}
              className={classes.buttonClass}
            >
              TEST ROUTE
            </button>
          </div>
          <div className={classes.ButtonCont}>
            <button
              onClick={() => setdeleteroutemodal(true)}
              className={classes.buttonClass2}
            >
              DELETE ROUTE
            </button>
          </div>
        </div>
      </div>

      {/* TEST VERSION */}

      <TestComponent
        open={testmodalopen}
        istestsending={istestsending}
        testresult={testresult}
        testagain={() => settestresult("")}
        handleClose={() => {
          if (!istestsending) settestmodalopen(false);
        }}
        handleRouteTest={handleRouteTest}
      />

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
    </div>
  );
}

export default SMSROUTE;

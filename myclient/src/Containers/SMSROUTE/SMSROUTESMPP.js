import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import classes from "./SMSROUTE.module.css";
import { Button } from "@material-ui/core";
import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import MySelect from "../../Component/MySelect/MySelect";
import TestComponent from "./TestComponent";
function SMSROUTESMPP() {
  const [loading, setloading] = useState(false);
  const [name, setname] = useState("");
  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [input1, setinput1] = useState("");
  const [endpoint, setendpoint] = useState("");
  const [endpointedit, setendpointedit] = useState("");
  const [port, setport] = useState("");
  const [portedit, setportedit] = useState("");
  const [user, setuser] = useState("");
  const [useredit, setuseredit] = useState("");
  const [pass, setpass] = useState("");
  const [passedit, setpassedit] = useState("");
  const [routetype] = useState("SMPP");
  const [bindType, setbindType] = useState("");
  const [bindtypeedit, setbindtypeedit] = useState("");
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [istestsending, setistestsending] = useState(false);
  const [testmodalopen, settestmodalopen] = useState(false);
  const [deleteroutemodal, setdeleteroutemodal] = useState(false);
  const [testresult, settestresult] = useState("");
  const [smsspeed, setsmsspeed] = useState(100);
  const [showingspeedmodal, setshowingspeedmodal] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    getSMSROUTE(id);
  }, []);

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
      setname(data?.name);
      setendpoint(data?.config?.endpoint);
      setport(data?.config?.port);
      setuser(data?.config?.user);
      setpass(data?.config?.pass);
      setbindType(data?.config?.bindType);
      setloading(false);
      setsmsspeed(data.defaultsendspeed || 100);
    } catch (error) {
      console.log(error.response.data);

      setloading(false);

      seterrors(error.response.data); // must be an array;
    }
  };
  const handleRouteTest = async ({ fromphone, tophone, message }) => {
    setistestsending(true);
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/smsroutes/test-sms-route-smpp/${id}`,
        {
          fromphone,
          tophone,
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

  const smsroutecrud = async ({ deleteroute, setspeed, editsmpp }) => {
    try {
      let urlcrud = `${GLOBAL.domainMain}/api/smsroutes/edit-sms-route/${
        setspeed ? "setspeed" : editsmpp ? "edit-smpp" : null
      }/${id}`;

      if (deleteroute) {
        urlcrud = `${GLOBAL.domainMain}/api/smsroutes/delete/${id}`;
      }

      const { data } = await REQ(
        "post",
        urlcrud,
        setspeed
          ? {
              speed: input1,
            }
          : editsmpp
          ? {
              endpoint: endpointedit,
              port: portedit,
              bindType: bindtypeedit,
              user: useredit,
              pass: passedit,
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

      if (editsmpp) {
        handleclosesmppedit();

        setendpoint(data?.config?.endpoint);
        setport(data?.config?.port);
        setuser(data?.config?.user);
        setpass(data?.config?.pass);
        setbindType(data?.config?.bindType);
      }

      setinput1("");
      // setinput2("");
      clearSuccesses();
      // seteditmode("");
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
    }, 8000);
  };

  const clearSuccesses = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const startofsmppedit = () => {
    setendpointedit(endpoint);
    setportedit(port);
    setuseredit(user);
    setpassedit(pass);
    setbindtypeedit(bindType);
    seteditmodalshowing(true);
  };

  const handleclosesmppedit = () => {
    seteditmodalshowing(false);

    // setnameedit()
    setendpointedit("");
    setportedit("");
    setuseredit("");
    setpassedit("");
    setbindtypeedit("");
    // setEditMode(false);
    // seteditid("");
    // seteditname("");
  };
  const editsmppconfigmodal = (
    <MyModal
      open={editmodalshowing}
      maxWidth="600px"
      handleClose={handleclosesmppedit}
    >
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>
          Edit SMPP CONFIGURATION
        </h4>
        <br></br>

        <div>
          <br></br>
          <MyInput
            value={endpointedit}
            onChange={(e) => setendpointedit(e.target.value)}
            label="END POINT IP"
            placeholder="eg: 0.0.0.0.0"
          />
          <br></br>
          <MyInput
            value={portedit}
            onChange={(e) => setportedit(e.target.value)}
            label="PORT"
            placeholder="eg: 3000"
          />
          <br></br>

          <MyInput
            value={useredit}
            onChange={(e) => setuseredit(e.target.value)}
            label="User Name"
            placeholder="Enter SMPP user name"
          />

          <br></br>
          <MyInput
            value={passedit}
            type="password"
            onChange={(e) => setpassedit(e.target.value)}
            label="Password"
            placeholder=" Enter SMPP Password"
          />
          <br></br>
          <MySelect
            label="Select  Bindtype"
            value={bindtypeedit}
            onChange={(e) => {
              setbindtypeedit(e.target.value);
            }}
          >
            <option value="">-- Select Bind Type --</option>
            <option value="transceiver">Transceiver</option>
            <option value="transmitter">Transmitter</option>
          </MySelect>
          <br></br>
        </div>
        <br></br>

        <div className={classes.ButtonCont2}>
          <Button
            onClick={() =>
              smsroutecrud({
                editsmpp: true,
              })
            }
            className={classes.buttonClass}
            variant="contained"
            color="primary"
            style={{ background: "black", width: "100%", color: "white" }}
          >
            Confirm Edit
          </Button>
        </div>
      </div>
    </MyModal>
  );
  return (
    <div>
      {editsmppconfigmodal}
      {setspeedmodal}
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
              <br />

              <p className={classes.TPS} style={{ textAlign: "left" }}>
                <span className={classes.credtitle}>Route type</span>
                {"  "}
                {routetype}
                {/* <FontAwesomeIcon icon={faPen} /> */}
              </p>
              <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

              {/* SET SPEED  */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span style={{ background: "darkblue" }}>
                    ROUTE TEXT SPEED
                  </span>
                </div>
              </div>
              <div className={classes.ButtonEdit}>
                <p className={classes.TPS}>{smsspeed} Texts/second</p>
                <button
                  onClick={() => {
                    setinput1(smsspeed);
                    // setinput2("");
                    setshowingspeedmodal(true);
                  }}
                >
                  EDIT TPS <FontAwesomeIcon icon={faPen} />
                </button>
              </div>

              {/* SET ENDPOINT IP  */}
              <div className={classes.SMSHEADERSSECTION}>
                <div className={classes.First}>
                  <span className="shadow" style={{ background: "#222" }}>
                    SMPP CONFIGURATION
                  </span>
                </div>
              </div>
              {/* <div className={classes.ButtonEdit}>
                <button
                  onClick={() => {
                    setinput1(smsspeed);
                    setinput2("");∫∫
                    setshowingspeedmodal(true);
                  }}>
                  Set Endpoint <FontAwesomeIcon icon={faPen} />
                </button>
              </div> */}
            </div>
          )}

          <div className={classes.smppcredcont}>
            <p className={classes.TPS}>
              <span className={classes.credtitle}>Endpoint IP</span> {endpoint}
              <FontAwesomeIcon icon={faPen} onClick={startofsmppedit} />
            </p>
            <p className={classes.TPS}>
              <span className={classes.credtitle}>Endpoint PORT</span>
              {"  "}
              {port}
              <FontAwesomeIcon icon={faPen} onClick={startofsmppedit} />
            </p>
            <p className={classes.TPS}>
              <span className={classes.credtitle}>Bind type </span> {"  "}{" "}
              {bindType}
              <FontAwesomeIcon icon={faPen} onClick={startofsmppedit} />
            </p>
            <p className={classes.TPS}>
              <span className={classes.credtitle}>User </span> {"  "} {user}
              <FontAwesomeIcon icon={faPen} onClick={startofsmppedit} />
            </p>
            <p className={classes.TPS}>
              <span className={classes.credtitle}>Password</span> {"  "}{" "}
              {pass
                .split("")
                .map((c) => "*")
                .join("")}
              <FontAwesomeIcon icon={faPen} onClick={startofsmppedit} />
            </p>
          </div>

          <br></br>
          {/* <div className={classes.ButtonEdit}>
            <Button
              variant="contained"
              // type="primary"
              color="primary"
              style={{ width: "100%", background: "black" }}
              onClick={() => {
                setinput1(smsspeed);
                setinput2("");
                setshowingspeedmodal(true);
              }}>
              Set Endpoint <FontAwesomeIcon icon={faPen} />
            </Button>
          </div> */}
          <br></br>
          <div className={-classes.ButtonCont}>
            <Button
              onClick={() => settestmodalopen(true)}
              variant="contained"
              // type="primary"
              color="primary"
              style={{ width: "100%", background: "black" }}

              // className={classes.buttonClass}>
            >
              TEST ROUTE
            </Button>
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
        setistestsending={setistestsending}
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

export default SMSROUTESMPP;

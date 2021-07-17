// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./Namecheap.module.css";

import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import MyInput from "../../Component/Input/Input";
import MyModal from "../../Component/MyModal/MyModal";

import { Button, LinearProgress } from "@material-ui/core";
import socketIOClient from "socket.io-client";

import DomainSearcher from "./DomainSearcher";
import EnterDomainGroupTrafficDataOwner from "./EnterDomainGroupTrafficDataOwner";

function Namecheap({ history }) {
  const [loading, setloading] = useState(true);
  //   const [socket] = useState(socketIOClient(GLOBAL.domainDomains));
  const [errors, seterrors] = useState([]);
  const [_, seterrormode] = useState(false);
  const [myapikey, setapikey] = useState("");
  const [mynamecheapusername, setmynamecheapusername] = useState("");
  const [balance, setbalance] = useState(null);
  const [ispurchasing, setispurchasing] = useState(false);
  const [socket, setsocket] = useState(null);
  const [configurationmodalshowing, setconfigurationmodalshowing] =
    useState(false);
  const [apikeyconfigure, setapikeyconfigure] = useState("");
  const [apiusername, setapiusername] = useState("");
  const [configurationpresent, setconfigurationpresent] = useState(false);
  const [successes, setsuccesses] = useState([]);

  const [tldlistfrombackendparent, settldlistfrombackend] = useState([]);
  const [_fetchingdomains, _setfetchingdomains] = useState(false);

  const [fetchcomplete, setfetchcomplete] = useState(false);
  const [fetcherror, setfetcherror] = useState(false);

  const [purchasetime, setpurchasetime] = useState(false);
  const [purchasedone, setpurchasedone] = useState(false);

  const [domaingroup, setdomaingroup] = useState("");
  const [traffic, settraffic] = useState("");
  const [datasupplier, setdatasupplier] = useState("");
  const [editingconfig, seteditingconfig] = useState("");
  const [domaingroups, setdomaingroups] = useState([]);
  const [showdomaingroups, setshowdomaingroups] = useState(false);
  const [traffics, settraffics] = useState([]);
  const [showtraffics, setshowtraffics] = useState(false);
  const [datasuppliers, setdatasuppliers] = useState([]);
  const [showdatasuppliers, setshowdatasuppliers] = useState(false);

  const [selecteddomaingroup, setselecteddomaingroup] = useState({
    _id: "",
    name: "",
  });
  const [selectedtraffic, setselectedtraffic] = useState({
    _id: "",
    name: "",
  });
  const [selecteddatasupplier, setselecteddatasupplier] = useState({
    _id: "",
    name: "",
  });

  const getbalance = (socket) => {
    socket.emit("get_balance", true);
  };
  useEffect(() => {
    _checkverificationstatus();

    const _socket = socketIOClient(GLOBAL.domainDomains, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    _socket.on("tldlist", (tldlistfrombackend) => {
      console.log(tldlistfrombackend);
      setfetcherror(false);

      _setfetchingdomains(true);
      settldlistfrombackend(tldlistfrombackend);

      console.log(tldlistfrombackendparent);
    });
    _socket.on("tldlistadd", (tldlistfrombackendupdate) => {
      console.log(tldlistfrombackendupdate);
      console.log(tldlistfrombackendparent);

      settldlistfrombackend((prev) => [...prev, ...tldlistfrombackendupdate]);
    });
    _socket.on("fetch_complete", (tldlistfrombackendupdate) => {
      setfetchcomplete(true);
    });

    _socket.on("balance", (_balance) => {
      console.log(_balance);

      setbalance(_balance);
    });

    _socket.on("errors-domain-check", (errorObject) => {
      seterrors(errorObject.errors);
      setfetcherror(true);
      clearErrors();
    });
    _socket.on("success-purchase", (succesobject) => {
      setispurchasing(false);
      setpurchasedone(succesobject.msg);
    });
    _socket.on("errors", (errorObject) => {
      setispurchasing(false);

      seterrors(errorObject.errors);
      clearErrors();
    });
    getbalance(_socket);
    setInterval(() => {
      getbalance(_socket);
    }, 120000);
    setsocket(_socket);
  }, []);

  const _checkverificationstatus = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/domains/check-configuration-status/namecheap`,
        null,
        true
      );

      seterrormode(false);
      console.log(res);
      if (!res.data?.user) {
        setconfigurationpresent(false);
        setconfigurationmodalshowing(true);
      } else {
        setconfigurationpresent(true);
        setapikey(res.data.apikey);

        setmynamecheapusername(res.data?.username);
      }
      // setdomaingrouplist(res.data);

      setloading(false);
    } catch (error) {
      console.log(error.response.data);
      seterrormode(true);

      seterrors([
        {
          msg: "An Error Occured Namecheap Purchase",
        },
      ]);
      clearErrors();
      setloading(false);
    }
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/dataowner`,
        null,
        true
      );
      console.log(res);
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

  const clearSuccesses = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const domain_CRUD = async ({ configureApiKey }) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/domains/${
          configureApiKey ? `configure-apikey/namecheap` : "create"
        }`,
        {
          apikey: apikeyconfigure,
          username: apiusername,
        },
        true
      );

      console.log(data);

      if (!data.user) {
        return setloading(false);
      }

      setconfigurationmodalshowing(false);
      setconfigurationpresent(true);

      setmynamecheapusername(data.username);
      setapikey(data.apikey);
      setsuccesses([
        {
          msg: "successfully updated your credentials",
        },
      ]);

      clearSuccesses();
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };

  const fuzzysearch = async ({ name, value }) => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${name}/fuzzy-search?value=${value}`,
        null,
        true
      );

      console.log(data);

      console.log(name);
      if (name === "domaingroup") {
        setdomaingroups(data);
      } else if (name === "dataowner") {
        setdatasuppliers(data);
      } else if (name === "verticals") {
        settraffics(data);
      }
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  const selectitemhandler = (item, value) => {
    console.log(item);
    if (value === "domaingroup") {
      setdomaingroup(item.name);
      setshowdomaingroups(false);

      setselecteddomaingroup((prev) => {
        return {
          ...prev,
          name: item.name,
          _id: item._id,
        };
      });
    } else if (value === "dataowner") {
      setdatasupplier(item.name);
      setshowdatasuppliers(false);

      setselecteddatasupplier((prev) => {
        return {
          ...prev,
          name: item.name,
          _id: item._id,
        };
      });
    } else if (value === "verticals") {
      settraffic(item.name);
      setshowtraffics(false);

      setselectedtraffic((prev) => {
        return {
          ...prev,
          name: item.name,
          _id: item._id,
        };
      });
    }
  };

  const handleblurremotely = async (e, value) => {
    if (value === "domaingroup") {
      try {
        setshowdomaingroups(false);
        console.log(document.querySelector("#domaingroup").value, 265);
        if (document.querySelector("#domaingroup").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#domaingroup").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#domaingroup").value);
          if (!data[0]) {
            setdomaingroup("");
            setselecteddomaingroup(null);
          } else {
            setdomaingroup(data[0].name);
            setselecteddomaingroup(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (value === "dataowner") {
      try {
        setshowdatasuppliers(false);
        console.log(document.querySelector("#datasupplier").value, 265);
        if (document.querySelector("#datasupplier").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#datasupplier").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#datasupplier").value);
          if (!data[0]) {
            setdatasupplier("");
            setselecteddatasupplier(null);
          } else {
            setdatasupplier(data[0].name);
            setselecteddatasupplier(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (value === "verticals") {
      try {
        setshowtraffics(false);
        console.log(document.querySelector("#traffic").value, 265);
        if (document.querySelector("#traffic").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#traffic").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#traffic").value);
          if (!data[0]) {
            settraffic("");
            setselectedtraffic(null);
          } else {
            settraffic(data[0].name);
            setselectedtraffic(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const inputblurhandler = async (e, value) => {
    if (value === "domaingroup") {
      try {
        // setshowdomaingroups(false);
        console.log(document.querySelector("#domaingroup").value, 265);
        if (document.querySelector("#domaingroup").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#domaingroup").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#domaingroup").value);
          if (!data[0]) {
            setdomaingroup("");
            setselecteddomaingroup(null);
          } else {
            setdomaingroup(data[0].name);
            setselecteddomaingroup(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (value === "dataowner") {
      try {
        // setshowdatasuppliers(false);
        console.log(document.querySelector("#datasupplier").value, 265);
        if (document.querySelector("#datasupplier").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#datasupplier").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#datasupplier").value);
          if (!data[0]) {
            setdatasupplier("");
            setselecteddatasupplier(null);
          } else {
            setdatasupplier(data[0].name);
            setselecteddatasupplier(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else if (value === "verticals") {
      try {
        // setshowtraffics(false);
        console.log(document.querySelector("#traffic").value, 265);
        if (document.querySelector("#traffic").value) {
          const { data } = await REQ(
            "get",
            `${GLOBAL.domainMain}/api/${value}/get-one?value=${
              document.querySelector("#traffic").value
            }`,
            null,
            true
          );

          console.log(data, document.querySelector("#traffic").value);
          if (!data[0]) {
            settraffic("");
            setselectedtraffic(null);
          } else {
            settraffic(data[0].name);
            setselectedtraffic(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const focusHandler = (e, value) => {
    if (value === "domaingroup") {
      setshowdomaingroups(true);
      setshowdatasuppliers(false);
      setshowtraffics(false);
    } else if (value === "dataowner") {
      setshowdatasuppliers(true);
      setshowdomaingroups(false);

      setshowtraffics(false);
    } else if (value === "verticals") {
      setshowtraffics(true);
      setshowdatasuppliers(false);
      setshowdomaingroups(false);
    }
    fuzzysearch({
      name: value,
      value: e.target.value,
    });
  };
  const changehandler = (e, value) => {
    if (value === "domaingroup") {
      setdomaingroup(e.target.value);
    } else if (value === "dataowner") {
      setdatasupplier(e.target.value);
    } else if (value === "verticals") {
      settraffic(e.target.value);
    }
    fuzzysearch({
      name: value,
      value: e.target.value,
    });
  };
  const createDataownermodal = (
    <MyModal
      open={configurationmodalshowing}
      maxWidth="600px"
      handleClose={() => {
        if (editingconfig) {
          setconfigurationmodalshowing(false);
          seteditingconfig(false);
        }
      }}
    >
      <div className="">
        {editingconfig ? null : (
          <Link
            onClick={() => {
              window.history.back();
            }}
            style={{ color: "blue", textDecoration: "none" }}
          >
            Back
          </Link>
        )}
      </div>
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>
          Configure your Namecheap Route
        </h4>
        <br></br>
        <MyInput
          value={apikeyconfigure}
          onChange={(e) => setapikeyconfigure(e.target.value)}
          type="password"
          label="Please enter a valid Namecheap API KEY"
          placeholder="My API KEY"
        />
        <br></br>

        <MyInput
          value={apiusername}
          onChange={(e) => setapiusername(e.target.value)}
          label="Please enter API user name"
          placeholder="My Username"
        />
        <br></br>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() =>
              domain_CRUD({
                configureApiKey: true,
              })
            }
            className={classes.buttonClass}
          >
            {editingconfig
              ? "Edit Namecheap Credentials"
              : "Configure Namecheap"}
          </Button>
        </div>
      </div>
    </MyModal>
  );
  const isPurchasingModal = (
    <MyModal open={ispurchasing} maxWidth="600px" handleClose={() => {}}>
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>Purchasing Domains</h4>
        <br></br>
        <LinearProgress />
      </div>
    </MyModal>
  );
  const purchasedmodal = (
    <MyModal
      open={purchasedone}
      maxWidth="600px"
      handleClose={() => {
        // setpurchasedone(false);
      }}
    >
      <div className={classes.InputCont}>
        <h2 style={{ textAlign: "center", fontWeight: 100 }}>
          Successful purchase
        </h2>
        <h4 style={{ color: "#222", fontWeight: 100, textAlign: "center" }}>
          {purchasedone}
        </h4>
        <br></br>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => {
              setpurchasetime(false);
              setfetcherror(false);
              setfetchcomplete(false);
              _setfetchingdomains(false);
              setpurchasedone("");
            }}
            className={classes.buttonClass}
          >
            Generate and Purchase Again
          </Button>
        </div>

        <div className={classes.ButtonCont}>
          <Button
            onClick={() => {
              history.push("/domains");
            }}
            className={classes.buttonClass}
          >
            View Domains
          </Button>
        </div>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => {
              history.push("/domain-groups");
            }}
            className={classes.buttonClass}
          >
            View Domain Groups
          </Button>
        </div>
      </div>
    </MyModal>
  );

  const startdomaingeneration = async ({ numberoflinks, selectedtlds }) => {
    // settldlistfrombackend([]);
    socket.emit("generate_domains", {
      numberoflinks,
      selectedtlds,
    });
  };

  const handleDomainPurchase = async () => {
    console.log(tldlistfrombackendparent);

    setispurchasing(true);

    if (
      tldlistfrombackendparent.length <= 0 ||
      !selecteddomaingroup?._id ||
      !selectedtraffic?._id ||
      !selecteddatasupplier?._id
    ) {
      seterrors({
        errors: [
          {
            msg: "Please ensure you have selected the important configurations",
          },
        ],
      });

      clearErrors();

      return;
    }
    console.log({
      domainstopurchase: tldlistfrombackendparent,
      domaingroupid: selecteddomaingroup._id,
      trafficid: selectedtraffic._id,
      datasupplierid: selecteddatasupplier._id,
    });
    socket.emit("purchase_domains", {
      domainstopurchase: tldlistfrombackendparent,
      domaingroupid: selecteddomaingroup._id,
      trafficid: selectedtraffic._id,
      datasupplierid: selecteddatasupplier._id,
    });
  };

  return (
    <Layout>
      {createDataownermodal}
      {isPurchasingModal}
      {purchasedmodal}
      <div className={classes.Vertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/dashboard",
            },
            {
              name: "Domains",
              link: "/domains",
            },
            {
              name: "Domain purchase method",
              link: "/domain-purchase",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Purchase Domains with Namecheap</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          {!configurationpresent ? (
            <MySkeletonLoader />
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{
                  background: "black",
                  // background: !sentresetlink ? "black" : "green",
                }}
                onClick={() => {
                  seteditingconfig(true);
                  setapikeyconfigure(myapikey);
                  setapiusername(mynamecheapusername);

                  setconfigurationmodalshowing(true);
                }}
              >
                Edit Namecheap Configuration
              </Button>
              <DomainSearcher
                startdomaingeneration={startdomaingeneration}
                tldlistfrombackend={tldlistfrombackendparent}
                socket={socket}
                fetchingdomains={_fetchingdomains}
                setfetchingdomains={_setfetchingdomains}
                fetchcomplete={fetchcomplete}
                setfetchcomplete={setfetchcomplete}
                settldlistfrombackend={settldlistfrombackend}
                purchasetime={purchasetime}
                fetcherror={fetcherror}
                balance={balance}
                setpurchasetime={setpurchasetime}
              />
            </>
          )}

          {purchasetime ? (
            <EnterDomainGroupTrafficDataOwner
              domaingroup={domaingroup}
              traffic={traffic}
              datasupplier={datasupplier}
              domaingroups={domaingroups}
              showdomaingroups={showdomaingroups}
              traffics={traffics}
              showtraffics={showtraffics}
              datasuppliers={datasuppliers}
              showdatasuppliers={showdatasuppliers}
              fuzzysearch={fuzzysearch}
              selectitemhandler={selectitemhandler}
              handleblurremotely={handleblurremotely}
              focusHandler={focusHandler}
              changehandler={changehandler}
              inputblurhandler={inputblurhandler}
            />
          ) : null}

          {purchasetime ? (
            <div className={classes.LoadingBody}>
              <button
                disabled={
                  tldlistfrombackendparent.length <= 0 ||
                  !selecteddomaingroup?._id ||
                  !selectedtraffic?._id ||
                  !selecteddatasupplier?._id
                }
                className={classes.Button}
                onClick={handleDomainPurchase}
              >
                PURCHASE DOMAINS
              </button>
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

export default Namecheap;

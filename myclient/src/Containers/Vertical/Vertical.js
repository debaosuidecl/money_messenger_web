// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "@material-ui/core";
import Layout from "../../Component/Layout/Layout";
import Routes from "../../Component/Routes/Routes";
import classes from "./Vertical.module.css";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import VerticalImage from "../../images/business2.jpg";
import { useParams, withRouter } from "react-router";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
function CreateVertical({ history }) {
  const [name, setname] = useState("");
  const [editname, seteditname] = useState("");
  const [user, setuser] = useState("");
  const [url, seturl] = useState("");
  const [editurl, setediturl] = useState("");
  const [postback, setpostback] = useState("");
  const [editpostback, seteditpostback] = useState("");
  const [loading, setloading] = useState(true);
  // const [isediting, setisediting] = useState(false);
  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [errors, seterrors] = useState([
    // {
    //   msg: "Incorrect password or email entered",
    // },
    // {
    //   msg: "Incorrect word or email entered",
    // },
  ]);
  const [successes, setsuccesses] = useState([
    // {
    //   msg: "Postback copied",
    // },
    // {
    //   msg: "Incorrect word or email entered",
    // },
  ]);

  // extract params
  const { id } = useParams();

  useEffect(() => {
    getVertical(id);
  }, []);

  const getVertical = async (id) => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/verticals/single/${id}`,
        null,
        true
      );

      if (!data.user) {
        return setloading(false);
      }
      setname(data.name);
      seteditname(data.name);
      seturl(data.url);
      setediturl(data.url);
      setuser(data.user);
      setpostback(data.postback);
      seteditpostback(data.postback);
      setloading(false);
    } catch (error) {
      console.log(error.response.data);

      seterrors(error.response.data); // must be an array;
    }
  };

  const editVertical = async () => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/verticals/edit/${id}`,
        {
          name: editname,
          url: editurl,
          postback: editpostback,
        },
        true
      );

      console.log(data);

      if (!data.user) {
        return setloading(false);
      }
      setname(data.name);
      seteditname(data.name);
      seturl(data.url);
      setediturl(data.url);
      setuser(data.user);
      setpostback(data.postback);
      seteditpostback(data.postback);
      setloading(false);
      seteditmodalshowing(false);
      setsuccesses([
        {
          msg: "Vertical edited!",
        },
      ]);
      clearSuccesses();
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };
  const deleteVertical = async () => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/verticals/delete/${id}`,
        {},
        true
      );

      history.push("/verticals");
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
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
  const copyPostback = () => {
    navigator.clipboard.writeText(postback);
    // alert("copied!");

    setsuccesses([
      ...successes,
      {
        msg: "Posback Copied!",
      },
    ]);

    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const editmodal = (
    <MyModal
      open={editmodalshowing}
      maxWidth="600px"
      handleClose={() => seteditmodalshowing(false)}
    >
      <div className={classes.InputCont}>
        <p style={{ color: "#666", fontWeight: 100, fontSize: 25 }}>
          Edit Vertical
        </p>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="Vertical Name"
        />

        <br></br>

        <MyInput
          value={editurl}
          onChange={(e) => setediturl(e.target.value)}
          label="Vertical url"
        />

        <br></br>

        <MyInput
          value={editpostback}
          onChange={(e) => seteditpostback(e.target.value)}
          label="Vertical postback"
        />

        <br />
        {/* <div className={classes.ButtonCont}>
          <Button
            onClick={() => editVertical()}
            className={classes.buttonClass}
          >
            Edit Vertical
          </Button>
        </div> */}
      </div>
    </MyModal>
  );
  const deleteModal = (
    <MyModal
      open={deletemodalshowing}
      maxWidth="600px"
      handleClose={() => setdeletemodalshowing(false)}
    >
      <div className={classes.InputCont}>
        <h1 style={{ color: "#777", fontWeight: 100 }}>Delete Vertical</h1>
        <br></br>
        <p>Are you sure you want to delete {name}?</p>
        <br />
        <div className={[classes.ButtonCont].join(" ")}>
          <Button
            onClick={() => deleteVertical()}
            className={[classes.buttonClass, classes.error].join(" ")}
          >
            Delete Vertical
          </Button>
        </div>
      </div>
    </MyModal>
  );
  return (
    <Layout>
      <div className={classes.CreateVertical}>
        {editmodal}
        {deleteModal}
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/dashboard",
            },
            {
              name: "Verticals",
              link: "/verticals",
            },
          ]}
        />
        <br />

        <div className={classes.Container}>
          {loading ? (
            <div className={classes.LoadingBody}>
              <MySkeletonLoader />
            </div>
          ) : user ? (
            <React.Fragment>
              <div className={classes.title}>
                <h1>Vertical: {name}</h1>
              </div>
              <div className={classes.body}>
                <br />

                <div className={classes.flex}>
                  <div className={classes.Title}>Tracking URL</div>
                  <div className={classes.subtitle2}>{url}</div>
                </div>
                {/* <div className={classes.flex}>
                  <Tooltip title="Click to copy postback" arrow>
                    <div
                      onClick={() => {
                        copyPostback();
                      }}
                      className={classes.Title}
                    >
                      Generated Postback
                    </div>
                  </Tooltip>
                  <div
                    onClick={() => {
                      copyPostback();
                    }}
                    className={classes.subtitle2}
                  >
                    {postback}
                  </div>
                </div>

                <p className={classes.ImportantText}>
                  Please copy and paste the postback in your affiliate marketing
                  website or edit the query parameters to suit your needs while
                  keeping the root URL and the 2 important pixels "campaignid"
                  and "clickid" for proper revenue tracking.
                </p> */}

                {/* <div className={classes.ButtonCont}>
                  <Button
                    onClick={() => seteditmodalshowing(true)}
                    className={classes.buttonClass}
                  >
                    Edit Vertical
                  </Button>
                </div> */}
                <div className={classes.ButtonCont}>
                  <Button
                    // onClick={handleCreateVertical}
                    onClick={() => setdeletemodalshowing(true)}
                    className={[classes.buttonClass, classes.error].join(" ")}
                  >
                    Delete Vertical
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div className={classes.LoadingBody}>
              <img src={VerticalImage} height="360px" alt="" />

              <p>This Vertical does not exist :(</p>
            </div>
          )}
        </div>
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
    </Layout>
  );
}

export default withRouter(CreateVertical);

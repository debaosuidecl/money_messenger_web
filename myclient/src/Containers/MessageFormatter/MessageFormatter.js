// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./MessageFormatter.module.css";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
// import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import MyModal from "../../Component/MyModal/MyModal";

import GLOBAL from "../GLOBAL/GLOBAL";
// import Loader from "../../Component/Loader/Loader";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import SingleMessageFormatter from "./SingleMessageFormatter";
import { Button } from "@material-ui/core";

import MyInput from "../../Component/Input/Input";

function MessageFormatter({ history }) {
  const [messagelist, setmessagelist] = useState([]);
  const [loading, setloading] = useState(true);
  const [editid, seteditid] = useState("");
  const [editname, seteditname] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [errors, seterrors] = useState([]);
  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [successes, setsuccesses] = useState([]);
  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/
  useEffect(() => {
    fetchVerticals();
  }, []);
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
        setmessagelist([]);
      } else
        setmessagelist((prev) => {
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

      setmessagelist((prev) => {
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
  const fetchVerticals = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/messageschema`,
        null,
        true
      );
      console.log(res);
      setmessagelist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const messageformatter_crud = async (isDeleting) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/create`,
        {
          name: editname,
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

      //   if (editMode && !isDeleting) {
      //     let copiedmessagelist = [...messagelist];

      //     copiedmessagelist = copiedmessagelist.map((domaingroup) => {
      //       if (domaingroup._id === data._id) {
      //         return {
      //           ...domaingroup,
      //           name: data.name,
      //         };
      //       }

      //       return domaingroup;
      //     });

      //     setmessagelist(copiedmessagelist);
      //     setsuccesses([
      //       {
      //         msg: "Message edited!",
      //       },
      //     ]);
      //   } else if (editMode && isDeleting) {
      //     let copiedmessagelist = [...messagelist];

      //     copiedmessagelist = copiedmessagelist.filter((domaingroup) => {
      //       return domaingroup._id !== data._id;
      //     });

      //     setmessagelist(copiedmessagelist);
      //     setsuccesses([
      //       {
      //         msg: "Message deleted!",
      //       },
      //     ]);
      //   } else {
      setmessagelist((prev) => [data, ...prev]);
      setsuccesses([
        {
          msg: "Message added!",
        },
      ]);
      history.push(`/campaign-message/${data._id}`);
      //   }

      clearSuccesses();
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };

  const createschemamodal = (
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
          Are you sure delete this Message?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may cause previous campaigns with data provided by this supplier
          to display: Deleted Supplier
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() => messageformatter_crud(true)}
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
          {editMode ? "Edit Message" : "Create Message Schema"}
        </h4>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="Set message schema name"
          placeholder="eg: My Awesome Message"
        />
        <br></br>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => messageformatter_crud()}
            className={classes.buttonClass}
          >
            {editMode ? "Edit Message" : "CREATE"}
          </Button>
        </div>

        {editMode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
            >
              Delete Message <F icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  return (
    <Layout>
      {createschemamodal}
      <div className={classes.Vertical}>
        <Routes
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
            <h1>My Message Schemas</h1>
          </div>

          <div
            onClick={() => seteditmodalshowing(true)}
            className={classes.createButton}
          >
            <Link>Create a Message Schema</Link>
            <F icon={faPlusCircle} />
          </div>
        </div>

        <div className={classes.Container2}>
          <MyInput
            placeholder="Search for your Message Schemas..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "messageschema")}
          />
        </div>

        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : messagelist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="360px" alt="" />

            <p>You have not created any Message Schema yet :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {/* <MyInput
              placeholder="Search for your Messages..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "messageschema")}
            /> */}
            {messagelist &&
              messagelist.map((messageschema, i) => {
                return (
                  <SingleMessageFormatter
                    key={i}
                    messageschema={messageschema}
                  />
                );
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && messagelist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("messageschema", page + 1)}
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
              <p
                className={classes.Error}
                key={e.msg}
                // style={{
                //   color: "red",
                //   margin: "0px",
                //   padding: "0px",
                //   fontSize: "15px",
                // }}
              >
                {e.msg}
              </p>
            );
          })}
      </div>
    </Layout>
  );
}

export default MessageFormatter;

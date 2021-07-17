// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./Dataowner.module.css";
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
// import Loader from "../../Component/Loader/Loader";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import SingleDataowner from "./SingleDataOwner";

function Dataowner() {
  const [dataownerlist, setdataownerlist] = useState([]);
  const [loading, setloading] = useState(true);
  const [errors, seterrors] = useState([]);
  const [editname, seteditname] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editid, seteditid] = useState("");

  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [successes, setsuccesses] = useState([]);

  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/
  const searchvaluechangehandler = async (e, option) => {
    setsearchvalue(e.target.value);
    setnomoreresults(false);

    setpage(0);

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/${option}/fuzzy-search?value=${e.target.value}&removenonetraffic=true`,
        null,
        true
      );

      console.log(data);
      setpage(0);

      if (data.length === 0) {
        // setnomoreresults(true);&removenonetraffic=true
        setdataownerlist([]);
      } else
        setdataownerlist((prev) => {
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

      setdataownerlist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  useEffect(() => {
    fetchDataowners();
  }, []);

  const fetchDataowners = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/dataowner`,
        null,
        true
      );
      console.log(res);
      setdataownerlist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const dataowner_CRUD = async (isDeleting) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/dataowner/${
          editMode && !isDeleting
            ? `edit/${editid}`
            : isDeleting
            ? `delete/${editid}`
            : "create"
        }`,
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

      if (editMode && !isDeleting) {
        let copieddataownerlist = [...dataownerlist];

        copieddataownerlist = copieddataownerlist.map((dataowner) => {
          if (dataowner._id === data._id) {
            return {
              ...dataowner,
              name: data.name,
            };
          }

          return dataowner;
        });

        setdataownerlist(copieddataownerlist);
        setsuccesses([
          {
            msg: "Data supplier edited!",
          },
        ]);
      } else if (editMode && isDeleting) {
        let copieddataownerlist = [...dataownerlist];

        copieddataownerlist = copieddataownerlist.filter((dataowner) => {
          return dataowner._id !== data._id;
        });

        setdataownerlist(copieddataownerlist);
        setsuccesses([
          {
            msg: "Data supplier deleted!",
          },
        ]);
      } else {
        setdataownerlist((prev) => [data, ...prev]);
        setsuccesses([
          {
            msg: "Data supplier added!",
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
  const createDataownermodal = (
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
          Are you sure delete this Data Supplier?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may cause previous campaigns with data provided by this supplier
          to display: Deleted Supplier
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() => dataowner_CRUD(true)}
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
          {editMode ? "Edit Data Supplier" : "Add Data Supplier"}
        </h4>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="Data Supplier Name"
          placeholder="eg: Facebook"
        />
        <br></br>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => dataowner_CRUD()}
            className={classes.buttonClass}
          >
            {editMode ? "Edit Data Supplier" : "Add Data Supplier"}
          </Button>
        </div>

        {editMode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
            >
              Delete Data Supplier <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  const showeditDataowner = (id, name) => {
    setEditMode(true);
    seteditid(id);
    seteditmodalshowing(true);
    seteditname(name);
  };
  return (
    <Layout>
      {createDataownermodal}
      <div className={classes.Vertical}>
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
            <h1>My Data Suppliers</h1>
          </div>

          <div
            onClick={() => seteditmodalshowing(true)}
            className={classes.createButton}
          >
            <Link> Create a Data Supplier</Link>
            <F icon={faPlusCircle} />
          </div>
        </div>

        <div className={classes.Container2}>
          <MyInput
            placeholder="Search For Data Suppliers..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "dataowner")}
          />
        </div>

        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : dataownerlist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="250px" alt="" />

            <p>You have not created any Data Supplier yet :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {/* <MyInput
              placeholder="Search for your Data Suppliers..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "dataowner")}
            /> */}
            {dataownerlist &&
              dataownerlist.map((dataonwer, i) => {
                return (
                  <SingleDataowner
                    showeditDataowner={showeditDataowner}
                    key={i}
                    dataowner={dataonwer}
                  />
                );
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && dataownerlist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("dataowner", page + 1)}
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

export default Dataowner;

import React, { useState, useEffect } from "react";
//@ts-ignore
import classes from "./User.module.css";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import MyInput from "../../Component/Input/Input";
import Routes from "../../Component/Routes/Routes";
import Layout from "../../Component/Layout/Layout";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GLOBAL from "../../Containers/GLOBAL/GLOBAL";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import SingleUser from "./SingleUser";
import { Button } from "@material-ui/core";
import { LinearProgress } from "@material-ui/core";
import REQ from "../../helperFunctions/requestModule";
import {
  //   faInfoCircle,
  faPlusCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import MyModal from "../../Component/MyModal/MyModal";
// @ts-ignore
import VerticalImage from "../../images/business2.jpg";

function Users() {
  const [userlist, setuserlist] = useState([]);
  const [loading, setloading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editname, seteditname] = useState("");
  const [editemail, seteditemail] = useState("");
  //   const [showinfo, setshowinfo] = useState(false);
  const [successes, setsuccesses] = useState([]);
  const [iscruding, setiscruding] = useState(false);
  //   const [errormode, seterrormode] = useState(true);
  const [editmodalshowing, seteditmodalshowing] = useState(false);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  const [errors, seterrors] = useState([]);

  const [editid, seteditid] = useState("");
  /* PAGINATION STATE */
  const [searchvalue, setsearchvalue] = useState("");
  const [page, setpage] = useState(0);
  const [nomoreresults, setnomoreresults] = useState(false);
  const [isfetching, setisfetching] = useState(false);
  /* PAGINATION STATE ENDS*/
  //   return <div></div>;

  useEffect(() => {
    fetchusers();
  }, []);

  const adminusercrud = async (isDeleting) => {
    try {
      setiscruding(true);
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/admin/user${
          editMode && !isDeleting
            ? `/edit/${editid}`
            : isDeleting
            ? `/delete/${editid}`
            : "/create"
        }`,
        {
          fullName: editname,
          email: editemail,
        },
        true
      );
      setiscruding(false);

      console.log(data);

      if (!data._id) {
        setiscruding(false);

        return setloading(false);
      }

      seteditmodalshowing(false);
      setEditMode(false);
      seteditid("");
      setdeletemodalshowing(false);

      if (editMode && !isDeleting) {
        let copieduserlist = [...userlist];

        copieduserlist = copieduserlist.map((user) => {
          if (user._id === data._id) {
            return {
              ...user,
              fullName: data.fullName,
            };
          }

          return user;
        });

        setuserlist(copieduserlist);
        setsuccesses([
          {
            msg: "User edited!",
          },
        ]);
      } else if (editMode && isDeleting) {
        let copieduserlist = [...userlist];

        copieduserlist = copieduserlist.filter((domaingroup) => {
          return domaingroup._id !== data._id;
        });

        setuserlist(copieduserlist);
        setsuccesses([
          {
            msg: "User deleted!",
          },
        ]);
      } else {
        setuserlist((prev) => [data, ...prev]);
        setsuccesses([
          {
            msg: "User Created. An email has been sent to your new user with their login credentials",
          },
        ]);
      }

      clearSuccesses();
    } catch (error) {
      setiscruding(false);

      console.log(error?.response?.data);

      seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    //@ts-ignore
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const clearSuccesses = () => {
    let timeoutval = 0;
    //@ts-ignore
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };
  const fetchusers = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/admin/user`,
        null,
        true
      );
      console.log(res);
      setuserlist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
    }
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
        setuserlist([]);
      } else
        setuserlist((prev) => {
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

      setuserlist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };

  const showEditDomainGroup = (id, name, email) => {
    setEditMode(true);
    seteditid(id);
    seteditmodalshowing(true);
    seteditname(name);
    seteditemail(email);
    // setrotationnumber(_rotationnumber || 10000);
  };

  const createDataownermodal = (
    <MyModal
      open={editmodalshowing}
      maxWidth="600px"
      handleClose={() => {
        seteditmodalshowing(false);
        setEditMode(false);
        seteditid("");
        seteditemail("");
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
          Are you sure delete this User?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This is a permanent action and will result in a user not being able to
          access his account forever. Be very careful before you confirm this
          action
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <Button
            color="primary"
            className="mr-2"
            style={{
              background: "red",
              color: "white",
              //   marginRight: 2,
              // width: "100%",
              //   background: !sentresetlink ? "black" : "green",
            }}
            onClick={() => adminusercrud(true)}
            // className={[classes.Option, classes.Red].join(" ")}
          >
            Yes
          </Button>
          <Button
            color="primary"
            style={{
              background: "black",
              color: "white",

              // width: "100%",
              //   background: !sentresetlink ? "black" : "green",
            }}
            onClick={() => setdeletemodalshowing(false)}
            className={[classes.Option, classes.black].join(" ")}
          >
            No
          </Button>
        </div>
      </MyModal>
      <div className={classes.InputCont}>
        <h4 style={{ color: "#222", fontWeight: 100 }}>
          {editMode ? "Edit User" : "Add User"}
        </h4>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="User Full Name"
          placeholder="eg: My Awesome User"
        />
        <br></br>

        <MyInput
          value={editemail}
          type="email"
          disabled={editMode}
          onChange={(e) => seteditemail(e.target.value)}
          label="User Email"
          placeholder="eg: awesomeuser@gmail.com"
        />
        <br></br>

        <div className={classes.ButtonCont}>
          <Button
            onClick={() => adminusercrud()}
            className={classes.buttonClass}
            // disabled={rotationnumber <= 0}
            variant="contained"
            color="primary"
            style={{
              background: "black",
              width: "100%",
              //   background: !sentresetlink ? "black" : "green",
            }}
          >
            {editMode ? "Edit User" : "Add User"}
          </Button>
        </div>

        {editMode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
              style={{
                background: "red",
                marginTop: 10,
                color: "#fff",
                width: "100%",
                //   background: !sentresetlink ? "black" : "green",
              }}
            >
              Delete User {"  "}
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
      <br></br>
      {iscruding ? <LinearProgress /> : null}
    </MyModal>
  );
  return (
    <Layout>
      {createDataownermodal}

      <div className={classes.Vertical}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/admin/dashboard",
            },
          ]}
        />
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>My Users</h1>
          </div>

          <div className={classes.createButton}>
            <span onClick={() => seteditmodalshowing(true)}>
              Create New User
            </span>
            <F icon={faPlusCircle} />
          </div>
        </div>
        <div className={classes.Container2}>
          <MyInput
            placeholder="Search for your Domains..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "admin/user")}
          />
        </div>

        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : userlist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="360px" alt="" />

            <p>No Users</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {userlist &&
              userlist.map((user, i) => {
                return (
                  <SingleUser
                    user={user}
                    showEditDomainGroup={showEditDomainGroup}
                    key={i}
                  />
                );
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && userlist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("admin/user", page + 1)}
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

export default Users;

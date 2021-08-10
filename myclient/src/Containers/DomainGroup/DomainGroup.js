// @ts-nocheck
import React, { useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./DomainGroup.module.css";
import {
  FontAwesomeIcon as F,
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import VerticalImage from "../../images/business2.jpg";
import errorImage from "../../images/404.jpg";
import {
  faInfoCircle,
  faPlusCircle,
  faTrashAlt,
  faTimesCircle,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Info from "../../Component/Info/Info";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "../../Component/Routes/Routes";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
// import Loader from "../../Component/Loader/Loader";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import MyModal from "../../Component/MyModal/MyModal";
import MyInput from "../../Component/Input/Input";
import SingleDomainGroup from "./SingleDomainGroup";
import VideoDisplay from "../../Component/VideoDisplay/VideoDisplay";

function DomainGroup() {
  const [domaingrouplist, setdomaingrouplist] = useState([]);
  const [showingvideo, setshowingvideo] = useState(false)
  const [loading, setloading] = useState(true);
  const [errors, seterrors] = useState([]);
  const [editname, seteditname] = useState("");
  const [showinfo, setshowinfo] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errormode, seterrormode] = useState(true);
  const [editid, seteditid] = useState("");
  const [rotationnumber, setrotationnumber] = useState(0);
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
    // fetchVerticals();
    fetchdomaingroups();
  }, []);
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
        setdomaingrouplist([]);
      } else
        setdomaingrouplist((prev) => {
          return [...data];
        });
    } catch (error) {
      console.log(error);
    }
  };

  const setfetchvalue = async (option, newpage) => {
    console.log(option);
    setisfetching(true);
    setsearchvalue("");

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

      setdomaingrouplist((prev) => {
        return [...prev, ...data];
      });
    } catch (error) {
      // seterrorinfetch(error?.response?.data?.errors[0].msg);
    }
    setisfetching(false);
  };
  const fetchdomaingroups = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/domaingroup`,
        null,
        true
      );
      seterrormode(false);
      console.log(res);
      setdomaingrouplist(res.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      seterrormode(true);

      seterrors([
        {
          msg: "An Error Occured in fetching domain groups",
        },
      ]);
      clearErrors();
      setloading(false);
    }
  };

  const domaingroup_CRUD = async (isDeleting) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/domaingroup/${
          editMode && !isDeleting
            ? `edit/${editid}`
            : isDeleting
            ? `delete/${editid}`
            : "create"
        }`,
        {
          name: editname,
          rotationnumber: rotationnumber,
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
        let copieddomaingrouplist = [...domaingrouplist];

        copieddomaingrouplist = copieddomaingrouplist.map((domaingroup) => {
          if (domaingroup._id === data._id) {
            return {
              ...domaingroup,
              name: data.name,
            };
          }

          return domaingroup;
        });

        setdomaingrouplist(copieddomaingrouplist);
        setsuccesses([
          {
            msg: "Domain group edited!",
          },
        ]);
      } else if (editMode && isDeleting) {
        let copieddomaingrouplist = [...domaingrouplist];

        copieddomaingrouplist = copieddomaingrouplist.filter((domaingroup) => {
          return domaingroup._id !== data._id;
        });

        setdomaingrouplist(copieddomaingrouplist);
        setsuccesses([
          {
            msg: "Domain group deleted!",
          },
        ]);
      } else {
        setdomaingrouplist((prev) => [data, ...prev]);
        setsuccesses([
          {
            msg: "Domain group added!",
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
          Are you sure delete this Domain group?
        </h3>
        <p style={{ fontWeight: 100 }}>
          This may cause previous campaigns with data provided by this supplier
          to display: Deleted Supplier
        </p>

        <br />

        <div className={classes.ButtonCont}>
          <button
            onClick={() => domaingroup_CRUD(true)}
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
          {editMode ? "Edit Domain group" : "Add Domain group"}
        </h4>
        <br></br>
        <MyInput
          value={editname}
          onChange={(e) => seteditname(e.target.value)}
          label="Domain group Name"
          placeholder="eg: My Awesome Domain Group"
        />
        <br></br>

        <p className={classes.LinkRotationHeader}>
          Link Rotation Number{" "}
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={() => {
              setshowinfo(true);
              console.log("clicked");
            }}
          />{" "}
        </p>

        <div className={classes.InputRangeCont}>
          <input
            type="number"
            value={rotationnumber}
            onChange={(e) => setrotationnumber(e.target.value)}
          />
          {/* <span>{rotationnumber}</span> */}
          <input
            type="range"
            min={1000}
            onChange={(e) => setrotationnumber(e.target.value)}
            max={100000}
            value={rotationnumber}
          />
        </div>
        <div className={classes.ButtonCont}>
          <Button
            onClick={() => domaingroup_CRUD()}
            className={classes.buttonClass}
            disabled={rotationnumber <= 0}
          >
            {editMode ? "Edit Domain group" : "Add Domain group"}
          </Button>
        </div>

        {editMode ? (
          <div className={classes.ButtonCont}>
            <Button
              onClick={() => setdeletemodalshowing(true)}
              className={[classes.buttonClass2].join(" ")}
            >
              Delete Domain group <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ) : null}
      </div>
    </MyModal>
  );

  const showEditDomainGroup = (id, name, _rotationnumber) => {
    setEditMode(true);
    seteditid(id);
    seteditmodalshowing(true);
    seteditname(name);
    setrotationnumber(_rotationnumber || 10000);
  };

  const infomodal = (
    <Info
      show={showinfo}
      handleClose={() => {
        setshowinfo(false);
      }}
    >
      <p>
        The Link Rotation Number represents how many times you want a particular
        domain to be sent before it is replaced with another in the domain
        group.
      </p>
    </Info>
  );
  return (
    <Layout>
           <MyModal maxWidth={1000}  open={showingvideo}>
    <div className={classes.Flex}>

    <h2 style={{fontWeight: 200}}>Power SMS Domain Groups</h2>
      <F style={{cursor: "pointer"}}  onClick={()=>setshowingvideo(false)}  icon={faTimesCircle}/>
    </div>

      <VideoDisplay src="https://player.vimeo.com/video/585113720?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" title="Create A Vertical"/>
</MyModal>
      {createDataownermodal}
      {infomodal}
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
            <h1>My Domain groups</h1>
          </div>
          <div className={classes.Flex}>
          <div className={classes.createButton}  onClick={()=>setshowingvideo(true)}  >
            <span>Tutorial  <F icon={faVideo} /></span>
          
            </div>

          <div
            onClick={() => seteditmodalshowing(true)}
            className={classes.createButton}
          >
            <Link> Create a Domain group</Link>
            <F icon={faPlusCircle} />
          </div>
          </div>
        </div>

        <div className={classes.Container2}>
          <MyInput
            placeholder="Search for your Domain Groups..."
            value={searchvalue}
            onChange={(e) => searchvaluechangehandler(e, "domaingroup")}
          />
        </div>
        {loading ? (
          <div className={classes.LoadingBody}>
            <MySkeletonLoader />
          </div>
        ) : errormode ? (
          <div className={classes.LoadingBody}>
            <br />
            <br />
            <img src={errorImage} alt="error" height="240px" />
            <br />
            <p style={{ fontWeight: 100 }}>
              An error occured Please click{" "}
              <Link onClick={fetchdomaingroups}>here</Link> to reload
            </p>
          </div>
        ) : domaingrouplist.length <= 0 ? (
          <div className={classes.LoadingBody}>
            <img src={VerticalImage} height="250px" alt="" />

            <p>You have not created any Domain group yet :(</p>
          </div>
        ) : (
          <div className={classes.Container2}>
            {/* <MyInput
              placeholder="Search for your Domain Groups..."
              value={searchvalue}
              onChange={(e) => searchvaluechangehandler(e, "domaingroup")}
            /> */}
            {domaingrouplist &&
              domaingrouplist.map((domaingroup, i) => {
                return (
                  <SingleDomainGroup
                    showEditDomainGroup={showEditDomainGroup}
                    key={i}
                    domaingroup={domaingroup}
                  />
                );
              })}
            <div className={classes.loadmorecont}>
              {nomoreresults ? (
                <p style={{ textAlign: "center", fontWeight: 100 }}>
                  End of results
                </p>
              ) : !nomoreresults && domaingrouplist.length > 0 ? (
                <button
                  disabled={isfetching}
                  onClick={() => setfetchvalue("domaingroup", page + 1)}
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

export default DomainGroup;

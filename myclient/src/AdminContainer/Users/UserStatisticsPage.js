import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Component/Layout/Layout";
import { Button } from "@material-ui/core";
import MyModal from "../../Component/MyModal/MyModal";

import REQ from "../../helperFunctions/requestModule";
// @ts-ignore
import VerticalImage from "../../images/business2.jpg";
import GLOBAL from "../../Containers/GLOBAL/GLOBAL";
// import { LinearProgress } from "@material-ui/core";
import StatisticsCont from "./StatisticsCont";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import Routes from "../../Component/Routes/Routes";
//@ts-ignore
import classes from "./User.module.css";
function UserStatisticsPage() {
  const [name, setname] = useState("");
  const [activesub, setactivesub] = useState(false);
  const [blocked, setblocked] = useState(false);
  const [email, setemail] = useState("");
  const [campaigncount, setcampaigncount] = useState(0);
  const [messagecount, setmessagecount] = useState(0);
  const [deletemodalshowing, setdeletemodalshowing] = useState(false);
  //   const [successes, setsuccesses] = useState([]);
  const [errormode, seterrormode] = useState(false);
  //   const [errors, seterrors] = useState([]);

  const [loading, setloading] = useState(true);

  //effects

  useEffect(() => {
    fetchuser();
  }, []);
  //@ts-ignore
  const { id } = useParams();
  const fetchuser = async () => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/admin/user/single/${id}`,
        null,
        true
      );

      console.log(data);
      setloading(false);

      if (!data.user) {
        return seterrormode(true);
      }

      const { user, _campaigncount, _messagecount } = data;

      setname(user.fullName || "");
      setemail(user.email || "");

      setcampaigncount(_campaigncount || 0);
      setmessagecount(_messagecount || 0);
      setactivesub(user?.premium || false);
      setblocked(user?.blocked || false);
    } catch (error) {
      console.log(error?.response?.data);

      //   seterrors(error.response.data?.errors); // must be an array;
      clearErrors();
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    //@ts-ignore
    timeoutval = setTimeout(() => {
      //   seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const blockusertoggle = () => {};

  return (
    <Layout>
      <br />
      <Routes
        routeList={[
          {
            name: "Home",
            link: "/admin/dashboard",
          },
          {
            name: "User management",
            link: "/admin/user-management",
          },
        ]}
      />
      <br />
      <MyModal
        open={deletemodalshowing}
        handleClose={() => {
          setdeletemodalshowing(false);
        }}
        maxWidth="500px"
      >
        <h3 style={{ color: "red", fontWeight: 400 }}>
          Are you sure block this User?
        </h3>
        <p style={{ fontWeight: 100 }}>
          The user will not be able to perform any operations on their platform
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
            onClick={() => blockusertoggle()}
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
      <div className={classes.Vertical}>
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            {loading ? <h1> Loading ... </h1> : <h1>User: {name}</h1>}
          </div>
        </div>
        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : errormode ? (
            <>
              <img src={VerticalImage} height="360px" alt="" />

              <p>No Users</p>
            </>
          ) : (
            <StatisticsCont
              //   name={name}
              blockprompt={() => setdeletemodalshowing(true)}
              email={email}
              substatus={activesub}
              campaigncount={campaigncount}
              messagecount={messagecount}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserStatisticsPage;

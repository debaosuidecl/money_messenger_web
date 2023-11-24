import {
  faBullhorn,
  faEnvelope,
  faHandPointUp,
  faMoneyCheck,
  faPersonBooth,
  faUser,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext } from "react";
import Layout from "../../Component/Layout/Layout";
import { AuthContext } from "../../context/Auth.context";
import currencyformat from "../../helperFunctions/currencyformat";
import Card from "../../Component/Card/Card";
//@ts-ignore
import classes from "./Home.module.css";
import GLOBAL from "../../Containers/GLOBAL/GLOBAL";
import requestModule from "../../helperFunctions/requestModule";
import moment from "moment";
function Home() {
  ///context
  const { fullName } = useContext(AuthContext);

  //state
  const [users, setusers] = useState(0);
  const [clicks, setclicks] = useState(0);
  const [activesubscribers, setactivesubscribers] = useState(0);
  const [campaigncount, setcampaigncount] = useState(0);
  const [conversioncount, setconversioncount] = useState(0);
  const [messages, setmessages] = useState(0);
  useEffect(() => {
    getdashbaordstats();
  }, []);

  const getdashbaordstats = async () => {
    console.log("attempting at least");
    let weekstart = new Date(moment().startOf("month").toString()).getTime();
    let weekend = new Date(moment().endOf("month").toString()).getTime();

    try {
      const [
        _click,
        _usercount,
        _activesubscribers,
        _countcampaigns,
        _conversions,
        _messages,
      ] = await Promise.all([
        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/click-count-admin?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),
        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/user-count-admin?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),
        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/user-count-admin?start=${weekstart}&end=${weekend}&activesubscriber=1`,
          null,
          true
        ),
        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/campaign-count-admin?start=${weekstart}&end=${weekend}&activesubscriber=1`,
          null,
          true
        ),

        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/click-count-admin?start=${weekstart}&end=${weekend}&converter=1`,
          null,
          true
        ),

        requestModule(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/message-count-admin?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),
      ]);
      console.log(_messages, 8);
      setclicks(_click?.data?.msg || 0);
      setusers(_usercount?.data?.msg || 0);

      setactivesubscribers(_activesubscribers?.data?.msg || 0);
      setcampaigncount(_countcampaigns?.data?.msg || 0);
      setconversioncount(_conversions?.data?.msg || 0);
      setmessages(_messages?.data?.msg || 0);
      // console.log(_click, 50);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    //   @ts-ignore
    <Layout>
      <div className={classes.Container}>
        <h1>Welcome, {fullName}</h1>

        <h3 style={{ fontWeight: 100 }}>Statistics of users in your account</h3>
        <br />
        <div className={classes.Row}>
          {/* @ts-ignore */}
          <Card icon={faUser} title={users} subtitle="My Users" />
          {/* @ts-ignore */}
          <Card
            icon={faPersonBooth}
            title={activesubscribers}
            subtitle="Active Subscribers"
          />
          {/* @ts-ignore */}
          <Card
            icon={faMoneyCheck}
            title={conversioncount}
            subtitle="Total Conversions this month"
          />
          {/* @ts-ignore */}
          <Card
            icon={faHandPointUp}
            title={clicks}
            subtitle="Total Clicks this month"
          />
          {/* @ts-ignore */}
          <Card
            icon={faBullhorn}
            title={campaigncount}
            subtitle="Total Campaigns this month"
          />
          {/* @ts-ignore */}
          <Card
            icon={faEnvelope}
            title={currencyformat(messages.toFixed(0), {
              tofixednumber: 0,
            })}
            subtitle="Total Messages Sent this month"
          />
        </div>

        <br />
        {/* <UserActivity activities={[]} /> */}
      </div>
    </Layout>
  );
}

export default Home;

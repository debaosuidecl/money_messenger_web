//@ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import Layout from "../../Component/Layout/Layout";
import classes from "./Home.module.css";
import moment from "moment";
import Card from "../../Component/Card/Card";
import {
  faClipboardCheck,
  faMoneyCheck,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/Auth.context";
import MarketCharts from "../../Component/MarketCharts/MarketCharts";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import currencyformat from "../../helperFunctions/currencyformat";
function Home() {
  // states

  const [revenue, setrevenue] = useState(0);
  const [conversioncount, setconversioncount] = useState(0);
  const [clickcount, setclickcount] = useState(0);
  const [errors, seterrors] = useState([]);
  const [weekplot, setweekplot] = useState([]);

  // contexts
  const { fullName } = useContext(AuthContext);

  // effects
  useEffect(() => {
    // console.log();

    fetchrevenuehandler();
  }, []);

  const clearErrors = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };
  const bulkstatisticsfetch = async (multipromises) => {
    try {
      const stats = await Promise.all(multipromises);

      return stats;
    } catch (error) {
      console.log(error);
      return false;
    }

    // return stats;
  };

  function returndate(day) {
    return new Date(
      moment().startOf("week").add("days", day).toString()
    ).getTime();
  }
  const fetchrevenuehandler = async () => {
    let weekstart = new Date(moment().startOf("week").toString()).getTime();
    let weekend = new Date(moment().endOf("week").toString()).getTime();

    let sunday = { start: returndate(0), end: returndate(1) };
    let monday = { start: returndate(1), end: returndate(2) };
    let tuesday = { start: returndate(2), end: returndate(3) };
    let wednesday = { start: returndate(3), end: returndate(4) };
    let thursday = { start: returndate(4), end: returndate(5) };
    let friday = { start: returndate(5), end: returndate(6) };
    let saturday = { start: returndate(6), end: returndate(7) };

    try {
      const stats = await bulkstatisticsfetch([
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),

        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-count?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/click-count?start=${weekstart}&end=${weekend}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${sunday.start}&end=${sunday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${monday.start}&end=${monday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${tuesday.start}&end=${tuesday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${wednesday.start}&end=${wednesday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${thursday.start}&end=${thursday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${friday.start}&end=${friday.end}`,
          null,
          true
        ),
        REQ(
          "get",
          `${GLOBAL.domainMain}/api/leadactivity/conversion-amount?start=${saturday.start}&end=${saturday.end}`,
          null,
          true
        ),
      ]);

      if (!stats) {
        seterrors([
          {
            msg: "Could not fetch stats",
          },
        ]);

        clearErrors();
        return;
      }

      console.log(stats);

      setrevenue(stats[0].data?.msg);
      setconversioncount(stats[1].data?.msg);
      setclickcount(stats[2].data?.msg);
      let weekplotdata = stats.slice(3).map((val) => val.data.msg);

      setweekplot(weekplotdata);
    } catch (error) {
      console.log(error);
      seterrors([
        {
          msg: "Could not fetch stats",
        },
      ]);

      clearErrors();
    }
  };
  return (
    <Layout>
      <div className={classes.dashboard}>
        <div className={classes.container}>
          <p className={classes.title}>Welcome {fullName}</p>

          <div className={classes.Row}>
            <Card
              icon={faMoneyCheck}
              title={`$${currencyformat(revenue.toFixed(2))}`}
              subtitle="This week's Revenue"
            />

            <Card
              icon={faClipboardCheck}
              title={currencyformat(clickcount.toFixed(0))}
              subtitle="Clicks This week"
            />
            <Card
              icon={faShoppingBag}
              title={currencyformat(conversioncount.toFixed(0))}
              subtitle="Conversions This Week"
            />
          </div>

          <br></br>

          <div className={classes.title}>Market Overview</div>

          <MarketCharts weekplot={weekplot} />
        </div>
        <br />
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

export default Home;

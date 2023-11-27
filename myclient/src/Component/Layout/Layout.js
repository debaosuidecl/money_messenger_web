//@ts-nocheck
import React, { useState, useContext } from "react";
import classes from "./Layout.module.css";
import { withRouter, Link } from "react-router-dom";
import LoadScreen from "../../Containers/LoadScreen/LoadScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown } from "react-bootstrap";
import Logo from "../../images/logo1.jpg"
import {
  faChartLine,
  faCog,
  faDatabase,
  faGripHorizontal,
  faLink,
  faMapSigns,
  faMarker,
  // faRoute,
  faSms,
  faUserEdit,
  faUsersCog,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";

// import SideNav from "../SideNav/SideNav";

import { AuthContext } from "../../context/Auth.context";
function Layout({ children }) {
  const { loading, fullName, email, admin, logo, isauth, balance } =
    useContext(AuthContext);
  let [navitems] = useState([
    {
      name: "Dashboard",
      isactive: window.location.href.includes("dashboard"),
      link: "/dashboard",
      icon: faChartLine,
    },
    {
      name: "API Docs",
      isactive: window.location.href.includes("api"),
      link: "/apidocs",
      icon: faChartLine,
    },
    {
      name: "Verticals",
      icon: faGripHorizontal,
      isactive: window.location.href.includes("vertical"),

      link: "/verticals",
    },
    {
      name: "Data Providers",
      icon: faDatabase,
      isactive: window.location.href.includes("dataowner"),

      link: "/dataowners",
    },
    {
      name: "Domain Groups",
      icon: faVectorSquare,

      isactive: window.location.href.includes("domain-groups"),

      link: "/domain-groups",
    },

    {
      name: "Domains",

      isactive:
        window.location.href.includes("domains") ||
        window.location.href.includes("domain-purchase"),

      icon: faLink,
      link: "/domains",
    },

    // {
    //   name: "SMS Routes",
    //   icon: faRoute,
    //   link: "/sms-routes",
    //   isactive: window.location.href.includes("route"),
    // },
    {
      name: "My Leads",
      icon: faUsersCog,

      link: "/leads",
      isactive: window.location.href.includes("lead"),
    },

    {
      name: "Message Schema",
      icon: faSms,
      link: "/campaign-message",
      isactive: window.location.href.includes("campaign-message"),
    },

    // {
    //   name: "Campaigns",
    //   link: "/",
    //   icon: faMapSigns,
    //   isactive: window.location.href.includes("campaigns"),
    // },
  ]);

  const [adminnavs] = useState([
    {
      name: "Dashboard",
      isactive: window.location.href.includes("dashboard"),

      link: "/admin/dashboard",
      icon: faChartLine,
    },
    {
      name: "Update Logo",

      link: "/admin/logo/update",
      isactive: window.location.href.includes("logo"),

      icon: faMarker,
    },
    {
      name: "User Management",

      link: "/admin/user-management",
      isactive: window.location.href.includes("user-management"),

      icon: faUserEdit,
    },
  ]);
  // useEffect(() => {}, []);

  return (
    <>
      <div style={{ display: loading ? "block" : "none" }}>
        <LoadScreen />
      </div>
      <div className="">
        <div className={classes.TopBar}>
          {/* <h1>Custom Logo</h1> */}
          <img
            height="40px"
            src={Logo}
            // src="https://www.pngarts.com/files/12/Budget-Logo-PNG-Image-Background.png"
            alt="logo"
          />
          {isauth ? (
            <ul className={classes.linkCont}>
              {admin
                ? adminnavs.map((item) => (
                    <li key={item.name}>
                      <Link
                        style={{
                          color: item.isactive ? "crimson" : "black",
                        }}
                        to={item.link}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))
                : navitems.map((item) => (
                    <li key={item.name}>
                      <Link
                        style={{
                          color: item.isactive ? "crimson" : "black",
                        }}
                        to={item.link}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
            </ul>
          ) : null}
          <div className={classes.PaymentAndDropDown}>
            <Button
              onClick={() => {
                window.location.href = "/payments";
              }}
            >
              Topup Balance: ${balance.toFixed(2)}{" "}
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                <FontAwesomeIcon icon={faCog} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">
                  <div className={classes.flex}>
                    <div className={classes.CircleAvatar}>
                      {fullName?.substring(0, 1)?.toUpperCase()}
                    </div>
                    <div>({email})</div>
                  </div>
                </Dropdown.Item>
                {admin ? null : (
                  <>
                    <Dropdown.Item href="/info/update-my-info">
                      Update My Info
                    </Dropdown.Item>
                    <Dropdown.Item href="/info/update-my-info">
                      Payments
                    </Dropdown.Item>
                    <Dropdown.Item href="/frequently-asked-questions">
                      FAQs
                    </Dropdown.Item>
                  </>
                )}

                <div className={classes.mobileonly}>
                  {navitems.map((item) => (
                    <Dropdown.Item href={item.link} key={item.name}>
                      <Link
                        style={{
                          color: item.isactive ? "crimson" : "black",
                        }}
                        to={item.link}
                      >
                        {item.name}
                      </Link>
                    </Dropdown.Item>
                  ))}
                </div>
                <Dropdown.Item
                  onClick={() => localStorage.removeItem("token")}
                  href="/login"
                >
                  <span style={{ color: "red" }}>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className={classes.Layout}>
          {/* {!removesidenav ? (
            <SideNav navitems={admin ? adminnavs : navitems} />
          ) : null} */}
          <div className={classes.ChildrenPanel}>{children}</div>
        </div>
      </div>
    </>
  );
}

export default withRouter(Layout);

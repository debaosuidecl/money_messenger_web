// @ts-nocheck

import React from "react";
import classes from "./Layout.module.css";
import Logo from "./logo.png";

function Sidebar({ status, showingsidebar, setSideBar }) {
  return (
    <>
      <div
        onClick={() => setSideBar(false)}
        className={
          showingsidebar
            ? [classes.Backdrop, classes.Appear].join(" ")
            : classes.Backdrop
        }
      ></div>
      <div
        className={
          showingsidebar
            ? [classes.SideBar, classes.slideRight].join(" ")
            : classes.SideBar
        }
      >
        <ul className={classes.Content}>
          <li>
            <img src={Logo} width="150px" alt="" />
          </li>

          {status === "superadmin" ? (
            <>
              <li>
                <a href="/namecheap">Bulk Forward</a>
              </li>
              <li>
                <a href="/blacklist">Blacklist Identification</a>
              </li>
              <li>
                <a href="/click-tracker">Click Tracker</a>
              </li>
              <li>
                <a href="/conversion-tracker">Conversion Tracker</a>
              </li>
              <li>
                <a href="/message-formatter">Format message</a>
              </li>
              <li>
                <a href="/profit-sharers">Profit Sharers</a>
              </li>
              <li>
                <a href="/twilio-account-2">Twilio Account 2</a>
              </li>
              <li>
                <a href="/twilio-account-2-beta">Twilio Resend Beta</a>
              </li>
              <li>
                <a href="/two-way">2 way Engine Twilio </a>
              </li>
              <li>
                <a href="/conversation-creator">My Conversations</a>
              </li>
              <li>
                <a href="/ss7-2">Xeeb (T-MOBILE)</a>
              </li>
              <li>
                <a href="/twilio-account-2">SMS with Twilio 2</a>
              </li>
            </>
          ) : status === "viewer" ? (
            <>
              <li>
                <a href="/statistics">Conversion Stats</a>
              </li>
            </>
          ) : null}

          <li>
            <a onClick={() => localStorage.removeItem("token")} href="/auth">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;

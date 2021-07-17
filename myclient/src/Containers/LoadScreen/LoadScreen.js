//@ts-nocheck
import React from "react";
import Logo from "../../Component/Layout/logo.png";
import classes from "./LoadScreen.module.css";
function LoadScreen() {
  return (
    <div className={classes.LoadScreen}>
      <div className={classes.ImageSizing}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={classes["lds-ellipsis"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    // <div
    //   style={{
    //     background: "white",
    //     width: "100%",
    //     height: "100%",
    //     position: "fixed",
    //     zIndex: "4000",
    //   }}
    // >
    //   <img
    //     src={Gif}
    //     style={{
    //       position: "fixed",
    //       top: "50%",
    //       left: "50%",
    //       transform: "translate(-50%, -50%)",
    //     }}
    //   />
    // </div>
  );
}

export default LoadScreen;

// @ts-nocheck

import React, { Component } from "react";
import classes from "./Auth.module.css";
import axios from "axios";
import GLOBAL from "../GLOBAL/GLOBAL";
import { withRouter } from "react-router-dom";
// import Layout from "../../Component/Layout/Layout";
import { LinearProgress } from "@material-ui/core";

class Auth extends Component {
  state = {
    email: "",
    password: "",
    showauthenticating: false,
    errors: [
      // {
      //   msg: "Incorrect password or email entered",
      // },
      // {
      //   msg: "Incorrect word or email entered",
      // },
    ],
  };

  changeHandler = (e) => {
    this.setState({ [e.target.type]: e.target.value });
  };
  submitHandler = () => {
    this.setState({ errors: [], showauthenticating: true });

    axios
      .post(`${GLOBAL.domainMain}/api/auth`, {
        email: this.state.email,
        password: this.state.password,
      })
      .then(async (res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);

        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({
          errors: err.response.data.errors,
          showauthenticating: false,
        });
        let timeoutval = 0;
        timeoutval = setTimeout(() => {
          this.setState({ errors: [] });

          clearTimeout(timeoutval);
        }, 5000);
      });
  };
  render() {
    // console.log(this.props.isAuthenticated);
    return (
      <>
        <div className={classes.AuthCont}>
          <div className={classes.Auth}>
            {/* <div className={classes.descriptionCont}>
              <div className={classes.TitleCont}>
                <p className={classes.Title}>Welcome to Power SMS Land</p>
                <div className={classes.underline}></div>
              </div>
              <br />
              <br />
              <p className={classes.description}>
                SMS through POWER-SMS utilizing the best cutting edge
                technologies to ensure high deliverability rates. Build your
                routes with ease and track campaign performance.
              </p>
            </div>
             */}
            <div className={classes.Forms}>
              <div className={classes.TitleCont}>
                {" "}
                {/* <img
                  height="60px"
                  src="https://www.pngarts.com/files/12/Budget-Logo-PNG-Image-Background.png"
                  alt="logo"
                /> */}
                <p className={classes.Title}>Sign In</p>
                <div className={classes.underline}></div>
              </div>
              <br />
              <br />

              <div className={classes.FormCont}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  onChange={this.changeHandler}
                  value={this.state.email}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") this.submitHandler();
                  }}
                />
              </div>

              <br />

              <div className={classes.FormCont}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={this.changeHandler}
                  value={this.state.password}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") this.submitHandler();
                  }}
                />
              </div>
              <br />

              <div className={classes.FormCont}>
                <button onClick={this.submitHandler}>Sign in</button>
              </div>
              <br />

              {this.state.showauthenticating ? <LinearProgress /> : null}
            </div>
          </div>
        </div>
        <div className={classes.Errors}>
          {this.state.errors &&
            this.state.errors.map((e) => {
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
      </>
    );
  }
}
export default withRouter(Auth);

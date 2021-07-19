import React, { useContext, useState } from "react";
import Layout from "../../Component/Layout/Layout";
// @ts-ignore
import classes from "./UpdateLogo.module.css";
import { AuthContext } from "../../context/Auth.context";
import axios from "axios";
import GLOBAL from "../../Containers/GLOBAL/GLOBAL";
import { LinearProgress } from "@material-ui/core";
function UpdateLogo() {
  const { logo, autologin, favicon } = useContext(AuthContext);

  // state

  //   const [logoinfile, setlogoinfile] = useState(null);
  const [errors, seterrors] = useState([]);
  const [successes, setsuccesses] = useState([]);
  const [isuploading, setisuploading] = useState(false);

  const fileUpload = async (e, resource) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      setisuploading(true);

      if (e.target.files[0].size > 20_000_000) {
        seterrors([
          {
            msg: "sorry max size is 20 MB", //
          },
        ]);

        clearErrors();
        return;
      }
      //   setlogoinfile(e.target.files[0]);

      formData.append(resource, e.target.files[0]);

      try {
        const { data } = await axios.post(
          `${GLOBAL.domainMain}/api/user/${resource}/upload`,
          formData,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );

        console.log(data);
        setisuploading(false);
        autologin();

        //   console.log(data);

        clearSuccesses();
      } catch (error) {
        setisuploading(false);

        console.log(error?.response?.data);
        seterrors(
          error?.response?.data?.errors || [
            {
              errors: [
                {
                  msg: "An error occured during upload",
                },
              ],
            },
          ]
        );
        clearErrors();
      }
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    // @ts-ignore
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const clearSuccesses = () => {
    let timeoutval = 0;
    // @ts-ignore

    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };
  return (
    <Layout>
      <div className={classes.UploadLogo}>
        <br />
        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Customization</h1>
          </div>
        </div>

        <div className={classes.LoadingBody}>
          <h3 style={{ fontWeight: 100 }}>Current Logo</h3>
          <img height="150px" src={logo} alt="logo" />

          <br></br>
          <br></br>
          <input
            style={{
              transform: "scale(0.1)",
              width: 1,
            }}
            onChange={(e) => fileUpload(e, "logo")}
            id="logo"
            type="file"
          />
          <label
            htmlFor="logo"
            style={{
              background: "black",
              padding: 10,
              color: "white",
              borderRadius: 10,
              boxShadow: "1px 0px 4px #222",
              cursor: "pointer",
            }}
          >
            Update Logo
          </label>

          <br />
          <br />
          {/* {isuploading ? <LinearProgress /> : null} */}

          <h3 style={{ fontWeight: 100 }}>Current Favicon</h3>
          <img height="150px" src={favicon} alt="logo" />

          <br></br>
          <br></br>
          <input
            style={{
              transform: "scale(0.1)",
              width: 1,
            }}
            onChange={(e) => fileUpload(e, "favicon")}
            id="favicon22"
            type="file"
          />
          <label
            htmlFor="favicon22"
            style={{
              background: "black",
              padding: 10,
              color: "white",
              borderRadius: 10,
              boxShadow: "1px 0px 4px #222",
              cursor: "pointer",
            }}
          >
            Update favicon
          </label>

          <br />
          <br />
          {isuploading ? <LinearProgress /> : null}
        </div>
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

export default UpdateLogo;

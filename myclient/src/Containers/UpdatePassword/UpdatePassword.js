import React, { useEffect, useState, useContext } from "react";
import Layout from "../../Component/Layout/Layout";
import querystring from "query-string";
import { withRouter } from "react-router";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
//@ts-ignore
import classes from "./UpdatePassword.module.css";
import ImageAndMessage from "./ImageAndMessage";
import ResetPasswordForm from "./ResetPasswordForm";
import { AuthContext } from "../../context/Auth.context";

function UpdatePassword({ location, history }) {
  //state

  const [loading, setloading] = useState(true);
  const [email, setemail] = useState("");
  const [invalidlink, setinvalidlink] = useState(false);
  const [errors, seterrors] = useState([]);
  const [sending, setsending] = useState(false);

  const [urlparams, seturlparams] = useState({
    u: "",
    t: "",
  });

  // context
  const { resetpassword, setnewpassword } = useContext(AuthContext);

  //effects
  useEffect(() => {
    console.log(location);
    const pixels = querystring.parse(location.search);
    console.log(pixels);
    //@ts-ignore
    seturlparams(pixels);
    if (!pixels.u || !pixels.t) {
      setinvalidlink(true);
      setloading(false);
    }
    resetpasswordhandler(pixels.u, pixels.t);
  }, []);

  const resetpasswordhandler = async (u, t) => {
    const data = await resetpassword(u, t);
    console.log(data);

    if (!data || data?.errors) {
      setinvalidlink(true);
      setloading(false);
      setsending(false);
      return;
    }

    setemail(data.email);
    setloading(false);
    setsending(false);
  };

  const setnewpasswordhandler = async (pass, confpass) => {
    setsending(true);
    const data = await setnewpassword(
      pass,
      confpass,
      urlparams?.u,
      urlparams?.t
    );
    console.log(data);
    if (!data || data?.errors) {
      // set errors

      seterrors(
        data?.errors || [
          {
            msg: "An error occured",
          },
        ]
      );
      setsending(false);
      return;
    }

    console.log(data, 80);

    history.push("/reset-password-success");

    setsending(false);
  };

  return (
    // @ts-ignore
    <Layout removesidenav={true}>
      <div className={classes.Settings}>
        <div className={classes.LoadingBody}>
          {loading ? (
            <MySkeletonLoader />
          ) : invalidlink ? (
            <ImageAndMessage
              message="This Link has expired or is Invalid"
              src="https://media.istockphoto.com/vectors/exclamation-mark-in-bubble-speech-vector-icon-concept-os-attention-or-vector-id962564820?k=6&m=962564820&s=612x612&w=0&h=JDEHn2B5blpDFP0Y9HgUJ0C-ddL-NCQaAS-yL7QWwpQ="
            />
          ) : (
            <ResetPasswordForm
              email={email}
              disabled={sending}
              setnewpassword={setnewpasswordhandler}
            />
          )}
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
    </Layout>
  );
}

export default withRouter(UpdatePassword);

//@ts-nocheck
import React, { createContext, useState, useEffect } from "react";
import REQ from "../helperFunctions/requestModule";
import axios from "axios";
import GLOBAL from "../Containers/GLOBAL/GLOBAL";

export const AuthContext = createContext();

function AuthContextProvider({ children, location, history }) {
  function getFaviconEl() {
    return document.getElementById("favicon");
  }

  const [loading, setLoading] = useState(true);
  const [isauth, setauth] = useState(true);
  const [fullName, setFullName] = useState("");
  const [balance, setbalance] = useState(0);
  const [email, setemail] = useState("");
  const [admin, setadmin] = useState(false);
  const [logo, setlogo] = useState(false);
  const [favicon, setfavicon] = useState(false);
  const [premium, setpremium] = useState(false);
  const [company, setcompany] = useState("Loading...");
  // effects

  useEffect(() => {
    autologin();
    // handleGoogle();
  }, []);

  const resetpassword = async (u, t) => {
    console.log("blah");

    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/user/reset-password/${u}/${t}`
      );

      return data;
    } catch (error) {
      console.log(error?.reponse);
      return false;
    }
  };

  const setnewpassword = async (password, confirmPassword, u, t) => {
    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/user/reset-password/${u}/${t}`,
        {
          password,
          confirmPassword,
        }
      );

      return data;
    } catch (error) {
      console.log(error?.reponse?.data);
      return error?.response?.data;
      // return false;
    }
  };
  const autologin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // history.push("/login");
      // setLoading(false);
      const urlsplit = window.location.href.split("/");
      setauth(false);
      if (urlsplit[urlsplit.length - 1] !== "login") {
        window.location.href = "/login";
      }
    } else {
      let config = {
        headers: {
          "x-auth-token": token,
        },
      };
      let url = `${GLOBAL.domainMain}/api/auth/auto`;
      axios
        .get(url, config)
        .then((response) => {
          const {
            fullName,
            email,
            premium,
            admin,
            adminlogo,
            companyname,
            adminfavicon,
            balance,
          } = response.data;

          console.log(adminlogo);
          const urlsplit = window.location.href.split("/");

          if (
            !premium &&
            urlsplit[urlsplit.length - 1] !== "login" &&
            urlsplit[urlsplit.length - 1] !== "subscription"
          ) {
            window.location.href = "/subscription";
          } else {
            setFullName(fullName);
            setemail(email);
            setbalance(balance || 0);
            setpremium(premium || false);
            setadmin(admin || false);
            console.log(response.data);
            setauth(true);
            setcompany(companyname);
            document.title = companyname;
            setLoading(false);
            const favicon = getFaviconEl();
            favicon.href = adminfavicon;
            setfavicon(adminfavicon);
            setlogo(
              adminlogo ||
                "https://media.gcflearnfree.org/content/57a0a50b8d7fb205008d1d0a_08_02_2016/typo_kerning.png"
            );
          }
        })

        .catch((error) => {
          setLoading(false);

          console.log(error);

          if (error.response?.data.msg) {
            console.log(error.response.data.msg);
          }
        });
    }
  };
  const sendupdatepasswordlink = async () => {
    console.log("blah");

    try {
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/user/one-time-link`,
        {
          email,
        },
        false
      );

      console.log(data);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        loading,
        autologin,
        isauth,
        sendupdatepasswordlink,
        premium,
        logo,
        admin,
        fullName,
        email,
        resetpassword,
        setnewpassword,
        company,
        favicon,
        balance,
        // token,
        // loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

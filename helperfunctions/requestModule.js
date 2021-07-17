// import axios from "axios";
//@ts-nocheck
const axios = require("axios");

const requestModule = async (method, url, data, requirestoken) => {
  return new Promise(async (resolve, reject) => {
    // const token = localStorage.getItem("token");

    // if (requirestoken) {
    //   if (!token) {
    //     reject("No token");
    //   }
    // }

    let axiosObject = {
      method,
      url,
      data: method.toLowerCase() === "post" ? data : undefined,
      //   headers: requirestoken
      //     ? {
      //         "x-auth-token": token,
      //       }
      //     : undefined,
    };

    axiosObject = JSON.parse(JSON.stringify(axiosObject));

    axios(axiosObject)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

// export default requestModule;
module.exports = {
  requestModule,
};

const axios = require("axios");
const zlib = require('zlib');
const apikeyBLA = "EuG7PpNnW6AnseN7YQck";

class BlacklistExecutor {
  constructor(url, api_key, type) {
    this.url = url;
    this.api_key = api_key;
    this.type = type || "Native_BLA";

    this.BaseAxios = axios.create({
      baseURL: `https://api.blacklistalliance.net/standard/api/v3/bulkLookup/key`,
  
      transformRequest: axios.defaults.transformRequest.concat(
          function (data, headers) {
              // compress strings if over 1KB
              // console.log(data)
              const bodyLen = Buffer.byteLength(data, 'utf-8');
              if (typeof data === 'string' && data.length > 1024) {
                  const objBuf = Buffer.from(data, "utf-8");
                  const bodyContent = zlib.gzipSync(objBuf);
                  headers['Content-Encoding'] = 'gzip';
                  headers['Accept-Encoding'] = 'gzip';
                  headers['Content-Type'] = 'application/json';
                  headers['Content-Length'] = bodyLen;
                  console.log(bodyContent)
                  return bodyContent
              } else {
                  return data;
              }
  
          }
      )
  });
  }
  async fetchBlacklist(phoneList) {
    const config = {
      method: "post",
      forever: true,
      url: this.url,
      data: {
        api_key: this.api_key,
        country: "US",
        data: phoneList,
      },
    };
    try {
      const { data } = await axios(config);
      return Object.values(data["Response"]);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async fetchBlacklistB(phoneList){



  }

  // const
async  sendBLA(phoneList) {
  return new Promise((resolve, reject) => {
      this.BaseAxios
          .post(
              `/${this.api_key}`,
              {
                  phones: phoneList,
              },
              {
                  headers: {
                      'Content-Type': "application/json"
                  },
                  forever: true
              }


          )
          .then((res) => {
              console.log({res})
              resolve({ data: res.data, phoneList })
          })
          .catch((err) => {
              console.log({err});
              resolve({ data: err, phoneList })
          });

  });
}
}

module.exports = BlacklistExecutor;

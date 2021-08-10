
const axios = require("axios");

class BlacklistExecutor{
    constructor(url, api_key, type){
        this.url = url;
        this.api_key = api_key
        this.type = type || "Native_BLA"
        }  
    async fetchBlacklist(phoneList){
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
            const {data}  =  await axios(config);
            return Object.values(data['Response']);
        } catch (error) {
            console.log(error);
            return false;
        }    
    }
}

module.exports = BlacklistExecutor;
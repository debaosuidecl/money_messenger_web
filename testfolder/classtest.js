
// const axios = require("axios")
// class BlacklistExecutor{
//     constructor(url, api_key, type){
//            this.url = url;
//            this.api_key = api_key
//            this.type = type || "Native_BLA"

//        }  

//     returnurl(){
//         return this.url
//     }
//     async fetchBlacklist(phoneList){
//         console.log(this.url, this.api_key, "blah333")
//            const config = {
//                method: "post",
//                forever: true,
//                url: this.url,
//                data: {
//                api_key: this.api_key,
//                country: "US",
//                data: phoneList,
//                },
//            };
   

//            try {
               
//                const {data}  =  await axios(config);
//                console.log(data)
//                return Object.values(data['Response']);
//            } catch (error) {
//                 console.log(error);
//                 return false;
//            }    
//    }
// }


// const blacklistExecutor = new BlacklistExecutor("http://blookup.validito.com/lookup.php", "0af4a7de0536dff8ced8917765f663e0");

// console.log(blacklistExecutor.fetchBlacklist([{
//     phone: "19785947255"
// }]))


const array = [[{phone: "13131313"}, {phone: "23f33232"}], [{phone: "d2393fifdsf"}]]


console.log(array.flat())
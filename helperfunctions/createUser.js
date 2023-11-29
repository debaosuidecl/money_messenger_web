
const connectDB = require("../config/db");
const ApikeyModel = require("../models/Apikey.model");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

(
    async()=>{
      //  const salt = await bcrypt.genSalt(10); // create the salt
      //  password = await bcrypt.hash("RF7@293jsLOPdqP", salt); // to encrypt the user password
      //  console.log("this password: ",password);
      //  return;
      await connectDB();

    //  const up =  await User.findOneAndUpdate({
    //     _id: "65650649397c155d3c44489d"
    //   },{
    //     email: "hameetsethi@gmail.com",
    //     password: "$2a$10$SbARAR2psk.iS4DnbDmPUu9xZXBrckkRKdkRS8zhmDW5iLuXWDxNa",
    //     smppPass: "$2a$10$SbARAR2psk.iS4DnbDmPUu9xZXBrckkRKdkRS8zhmDW5iLuXWDxNa",

    //   },{new: true});

    //   return console.log({up})

      const user = await  new User({
        balance: 0,
        mmsender: true,
        premium: true,
        adminlogo: '',
        apikey: "3wR7xGp42323ff4jaiE2DSdfs2fDfG",
        adminfavicon: '',
        admin: false,
        fullName: "Rob Galapo",
        email: "info@dataorlead.com",
        editables: [],
        smppPass: "$2a$10$lkeKQPEn6.Enhiwk8eccIesaVTa/B8s3foPPUADXs7kmM2/734Z12",
        password: "$2a$10$lkeKQPEn6.Enhiwk8eccIesaVTa/B8s3foPPUADXs7kmM2/734Z12",
        status: "mmsender",
        username: "dataorlead",
        ipList: [
          
        ]
        

      }).save()

      console.log({user});

      const api_key = await  new ApikeyModel({
        user: user._id,
        apiKey : "3wR7xGp42323ff4jaiE2DSdfs2fDfG"
      }).save();

      console.log({api_key})


    }
)()
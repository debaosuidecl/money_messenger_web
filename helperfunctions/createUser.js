
const connectDB = require("../config/db");
const ApikeyModel = require("../models/Apikey.model");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

(
    async()=>{
      //  const salt = await bcrypt.genSalt(10); // create the salt
      //  password = await bcrypt.hash("Ss7@21!8iw78P", salt); // to encrypt the user password
      //  console.log(password);
      //  return;
      await connectDB();

     const up =  await User.findOne({
        _id: "6560fd4650a308700fc43ad8"
      });

      return console.log({up})

      const user = await  new User({
        balance: 0,
        mmsender: true,
        premium: true,
        adminlogo: '',
        apikey: "3wR7xGpFbHnJrMtQwVzYbEiUoPlAsDfG",
        adminfavicon: '',
        admin: false,
        fullName: "Hameet Paul Sethi",
        email: "Hameetsethi@gmail.com",
        editables: [],
        smppPass: "$2a$10$PJwHC6ChkHdCkjepyK2EdO1DUSqkm.FUFU5aaBdOuQCRhAI7gsRaS",
        password: "$2a$10$PJwHC6ChkHdCkjepyK2EdO1DUSqkm.FUFU5aaBdOuQCRhAI7gsRaS",
        status: "mmsender",
        username: "hameetsethi",
        ipList: [
          
        ]
        

      }).save()

      console.log({user});

      const api_key = await  new ApikeyModel({
        user: user._id,
        apiKey : "3wR7xGpFbHnJrMtQwVzYbEiUoPlAsDfG"
      }).save();

      console.log({api_key})


    }
)()

const connectDB = require("../config/db");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

(
    async()=>{
    //    const salt = await bcrypt.genSalt(10); // create the salt
    //    password = await bcrypt.hash("Ks7hGpW@^v9rLcUqA", salt); // to encrypt the user password
    //    console.log(password);
    //    return;
      await connectDB();
      const user = await  new User({
        balance: 0,
        mmsender: true,
        premium: true,
        adminlogo: '',
        adminfavicon: '',
        admin: false,
        fullName: "local user 1",
        email: "local@user.com",
        editables: [],
        smppPass: "$2a$10$zPlJNlgkJflDJiHWHPMF3.RgNobrfWcUkdZopXlEuI0GeFvh9qXuO",
        password: "$2a$10$zPlJNlgkJflDJiHWHPMF3.RgNobrfWcUkdZopXlEuI0GeFvh9qXuO",
        // password: ''
        status: "mmsender",
        username: "local_deba",
        ipList: [
            "::ffff:127.0.0.1"
        ]
        

      }).save()

      console.log({user});


    }
)()
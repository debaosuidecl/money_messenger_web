const smpp = require('smpp');
const connectDB = require("../config/db");
const User = require('../models/User');
const { createUserMessage } = require('../services/user.service');
const bcrypt = require('bcryptjs');

// Define valid IP addresses and corresponding usernames/passwords
/**
 * 
51.38.74.71
contact@sms-ads.com
 */
const authConnections = {
    // '::ffff:127.0.0.1': { username: 'user1', password: 'pass1' },

    // Add more IP addresses and credentials as needed
  };

const server = smpp.createServer( (session) => {
    // Check if the connection is allowed based on the client's IP address
    const clientIP = session.socket.remoteAddress;

    // if (!allowedConnections[clientIP]) {
    //   console.log(`Connection from unauthorized IP: ${clientIP}`);
    //   session.close();
    //   return;
    // }
  
    // Authenticate the user based on the provided credentials
    session.on('bind_transceiver', async (pdu) => {

       
      const { system_id, password } = pdu;
      const userFromIp = await User.findOne({
        username: system_id,

    });

    if(!userFromIp){
      console.log(`address not found : ${userFromIp}`);
      session.close();
      return;
    }

    const isMatch = await bcrypt.compare(password, userFromIp.password);

    if(!isMatch){
        console.log(`password does not match : ${isMatch}`);
        session.close();
        return;
    }


    const userIpList = userFromIp.ipList;

    if(userIpList.indexOf(clientIP) === -1){
      console.log(`Connection from unauthorized IP: ${clientIP}`, userIpList);
      session.send(pdu.response({ command_status: smpp.ESME_RBINDFAIL, message: "Unresolved IP" }));
    //   session.close();
      session.close();
      return;
    }

    
  
      console.log(`User ${system_id} authenticated from IP ${clientIP}`);

        authConnections[clientIP] = userFromIp._id;
      session.send(pdu.response());
    });
  
    session.on('submit_sm', async (pdu) => {
      console.log('Received submit_sm:', pdu);

      const {short_message} = pdu;
    try{
        let createdMessage = await createUserMessage({
        to: pdu.destination_addr,
        from: "money_messenger",
        message: short_message.message,
        user_id:  authConnections[clientIP],
      });

      console.log({createdMessage})
      session.send(
        pdu.response({
        message_id: `${createdMessage._id}`,
        command_status: 0, // ESME_ROK indicates success, adjust as needed
      }));
    } catch(e){
        console.log(e);
        const failureStatusCode = smpp.ESME_RTHROTTLED; // Adjust as needed
        session.send(pdu.response({
        command_status: 88,
        message: "Failed to create Message"
    }));
    }
  
      // Handle incoming messages
      // Access message content with pdu.short_message
    });
  });

server.listen(2775, async () => {
    await connectDB();
  console.log('SMPP server is listening on port 2775');
});
const smpp = require('smpp');

const session = smpp.connect('smpp://localhost:2775');

session.on('connect', () => {
  console.log('Connected to SMPP server');

  // Authentication information
  const system_id = 'local_deba';
  const password = 'Ks7hGpW@^v9rLcUqA';

  session.bind_transceiver({
    system_id: system_id,
    password: password,
  }, (pdu) => {
    if (pdu.command_status === 0) {
      console.log(`Successfully bound to the SMPP server as ${system_id}`);

      // Now you can send messages
      sendSMS();
    } else {
      console.log('Failed to bind to the SMPP server:', pdu);
      session.close();
    }
  });
});

function sendSMS() {
  const message = 'Hello, SMPP!';
  const destination = '+19788175080';

  session.submit_sm({
    source_addr: 'your_source_address',
    destination_addr: destination,
    short_message: message,
  }, (pdu) => {
    if (pdu.command_status === 0) {
        console.log(pdu)
      console.log('Message sent successfully:', pdu.message_id);
    } else {
      console.error('Error sending message:', pdu);
    }

    // Unbind and close the session
    // session.unbind();
    // session.close();
  });

 
}

session.on('close', () => {
  console.log('Connection closed');
});

session.on('error', (err) => {
  console.error('Connection error:', err);
});


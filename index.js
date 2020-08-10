'use strict'
// Starts the mailer daemon. This daemon listens incoming requests to
// send a mail to some address.

// Getting config module and fetching the config

var   server   = require('./server.js').app;
const port  = process.env.PORT || 3003;
console.log(`[?] Starting mailer service on port: ${port}`);
server.listen( port, () => {
  // The mailer server is up and running!
  console.log("[*] The mailer server is up and running.");
  console.log(`[*] Server mounted on: http://localhost:${port}`);
});

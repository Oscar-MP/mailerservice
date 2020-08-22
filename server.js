// This file contains all the logic of the mail server.

var express         = require('express');
var bodyParser      = require('body-parser');
var controller      = require('./controller.js');

var app = express();

// Starting up the server and middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Setting the headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'localhost');
  res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Allow', 'GET, POST');

  next();
});

// Logging all the requests to the mailer
app.use((req, res, next) => {
  console.log("A request have been made! More info will be added here");
  next();
});

app.use((req, res, next) => {
  // Since all requests must be autorized, this middleware will intercept a token and validate it through
  // the authentication service. A conexión will be stablished with this service and we won't trigger next()
  // until a response has arrived.

  // Now all this will be hand written, in the future the communication module will do the job


  // Once we are sure the request is legitimate we proceed to the next layer
  next();
});


// ROUTES OF THE MAILER
var router = require('./routes.js');
app.use('', router);


// Export the app to use it from the index.js file
module.exports = { app };

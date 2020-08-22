// This file contains all the logic of the mail server.

var express         = require('express');
var bodyParser      = require('body-parser');
var router          = require('./routes.js');

var app = express();

// Starting up the server and middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Setting the headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'localhost');
  res.header('Access-Control-Allow-Headers', 'x-access-token, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Allow', 'GET, POST');

  next();
});

// Logging all the requests to the mailer
app.use((req, res, next) => {
  console.info(`[REQUEST]: ${req.originalUrl} (${req.method}); [FROM]: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
  next();
});


// AUTHENTICATION AND AUTHORIZATION OF THE REQUEST
app.use((req, res, next) => {
  // Until the auth service is ready the auth is going to be fake.
  var auth_fake_tokens = ['776005134f754aa3c7c97c1339f0d147', '472ea74a097063403db334b0ff654ba4', '1d18ca1fa0cb566162468a8958830778'];
  let token = req.headers['x-access-token'];

  if (!token) {
      return res.status(403).send({ message: 'Token not provided!'});
  }

  if ( !auth_fake_tokens.includes(token)) {
    return res.status(401).send({ message: 'Unauthorized action!' });
  }


  next();
});


// ROUTES OF THE MAILER
app.use('', router);


// Export the app to use it from the index.js file
module.exports = { app };

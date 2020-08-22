'use strict'

// THIS FILE CONTAINS ALL THE ROUTES AND THE CALL TO THEIR RESPECTIVE
// CONTROLLER.

var express     = require('express');
var controller  = require('./controller.js');

var router = express.Router();

router.get('/', controller.info);

router.post('/send', controller.send);
router.get('/status', controller.getStatus);

router.get('/list/:id', controller.getList);              // Get the list information
router.post('/list/:id', controller.putList);             // Creates or updates a mail list
router.post('/list/send/:id', controller.broadcastMail);  // Sends a mail to a mail list

// Not found routes

router.get('*', controller.notFound);
router.post('*', controller.notFound);

module.exports = router;

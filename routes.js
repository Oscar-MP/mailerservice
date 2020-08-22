'use strict'

// THIS FILE CONTAINS ALL THE ROUTES AND THE CALL TO THEIR RESPECTIVE
// CONTROLLER.

var express     = require('express');
var controller  = require('./controller.js');

var router = express.Router();

router.get('/', controller.info);

router.post('/send', controller.send);
router.get('/status', controller.getStatus);


// Not found routes

router.get('*', controller.notFound);
router.post('*', controller.notFound);

module.exports = router;

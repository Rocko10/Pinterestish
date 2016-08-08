'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/auth/twitter', (req, res, next) => {
    res.end('Twitter login...');
});

module.exports = router;

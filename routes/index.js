'use strict';

var express = require('express');
var passport = require('passport');

var router = express.Router();

/* share data with the views */
router.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');

    next();

});

router.get('/', function(req, res, next) {
    res.render('index');
});

/* twitter auth */
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter',
{
    failureRedirect: '/',
    failureFlash: true
}), (req, res) => {
    /* successful redirect */
    res.redirect('/users/');
});
/* twitter auth */

module.exports = router;

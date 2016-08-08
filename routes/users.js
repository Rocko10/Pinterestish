var express = require('express');
var router = express.Router();

router.use((req, res, next) => {

    res.locals.currentUser = req.user,
    res.locals.infos = req.flash('info'),
    res.locals.errors = req.flash('error')

    next();

});

router.get('/', onlyAuth, function(req, res, next) {

    res.render('users/profile');

});

function onlyAuth(req, res, next){

    if(!req.isAuthenticated()){

        req.flash('error', 'Only auth people');

        return res.redirect('/');
    }

    next();

}

module.exports = router;

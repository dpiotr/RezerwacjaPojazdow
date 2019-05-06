let express = require('express');
let passport = require('passport');

let LoginValidator = require('../utils/LoginValidator');

let router = express.Router();

router.get('/', LoginValidator, function (req, res) {
    //TODO remove endpoint
    let user = req.user.dataValues;
    res.render('index', {title: "User od id " + user.id});
});

router.get('/login', function (req, res) {
    res.render('login_form');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login'}), function (req, res) {
    res.redirect('/auth');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/auth');
});

module.exports = router;
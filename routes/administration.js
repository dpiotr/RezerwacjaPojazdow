let express = require('express');
let passport = require('passport');

let router = express.Router();

let AdminLoginValidator = require('../utils/AdminLoginValidator');

router.get('/', AdminLoginValidator, function (req, res) {
    res.render('index_page', {
        title: 'Witaj, ' + req.user.dataValues.login + ", jesteś zalogowany jako administrator."
    });
});

router.get('/login', function (req, res) {
    if (req.user != null) {
        res.render('logout_admin_page', {login: req.user.dataValues.login});
    } else {
        res.render('login_admin_form');
    }
});

router.post('/login', passport.authenticate('localUser', {failureRedirect: '/administration/error'}), function (req, res) {
    res.redirect('/administration');
});

router.get('/error', function (req, res) {
    res.render('error_page', {message: "Wystąpił błąd przy logowaniu. Może podałeś zły login lub hasło?"});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/administration');
});

module.exports = router;
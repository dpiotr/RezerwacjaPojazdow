let express = require('express');
let passport = require('passport');

let ClientModel = require('../sequelize').Client;

let router = express.Router();

router.get('/login', function (req, res) {
    if (req.user != null) {
        res.render('logout_page', {login: req.user.dataValues.login});
    } else {
        res.render('login_form');
    }
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/error'}), function (req, res) {
    res.redirect('/');
});

router.get('/register', function (req, res) {
    res.render('register_form');
});

router.post('/register', function (req, res) {
    let login = req.body.login;
    let name = req.body.name;
    let surname = req.body.surname;
    let password = req.body.password;
    let password2 = req.body.password2;

    if (!login) {
        res.render('error_page', {message: "Pole login nie może być puste"});
        return;
    }

    if (!name) {
        res.render('error_page', {message: "Pole imię nie może być puste"});
        return;
    }

    if (!surname) {
        res.render('error_page', {message: "Pole nazwisko nie może być puste"});
        return;
    }

    if (!password) {
        res.render('error_page', {message: "Pole hasło nie może być puste"});
        return;
    }

    if (!password2) {
        res.render('error_page', {message: "Pole powtórz hasło nie może być puste"});
        return;
    }

    if (password !== password2) {
        res.render('error_page', {message: "Podane hasła nie są takie same"});
        return;
    }

    ClientModel
        .create(
            {
                name: name,
                surname: surname,
                login: login,
                password: password
            }
        )
        .then(user => {
            res.render('register_success')
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.get('/error', function (req, res) {
    res.render('error_page', {message: "Wystąpił błąd przy logowaniu. Może podałeś zły login lub hasło?"});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
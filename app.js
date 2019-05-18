var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var carsRouter = require('./routes/cars');
var reservationsRouter = require('./routes/reservations');
var administrationRouter = require('./routes/administration');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({secret: 'secret', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/cars', carsRouter);
app.use('/reservations', reservationsRouter);
app.use('/auth', authRouter);
app.use('/administration', administrationRouter);

passport.use('localClient', new LocalStrategy(
    {usernameField: "login", passwordField: "password"},
    function (username, password, cb) {
        let ClientModel = require('./sequelize').Client;

        ClientModel
            .findAll({
                where: {login: username}
            })
            .then(users => {
                if (users.length !== 1) {
                    return cb(null, false);
                }

                //TODO
                // if (user.password != password) {
                //     return cb(null, false);
                // }

                return cb(null, users[0]);
            })
            .catch(reason => {
                return cb(reason);
            })
    }));

passport.use('localUser', new LocalStrategy(
    {usernameField: "login", passwordField: "password"},
    function (username, password, cb) {
        let UserModel = require('./sequelize').User;

        UserModel
            .findAll({
                where: {login: username}
            })
            .then(users => {
                if (users.length !== 1) {
                    return cb(null, false);
                }

                //TODO
                // if (user.password != password) {
                //     return cb(null, false);
                // }

                return cb(null, users[0]);
            })
            .catch(reason => {
                return cb(reason);
            })
    }));

passport.serializeUser(function (user, cb) {
    let userId = user.dataValues.id;
    let userRole = user.dataValues.role;

    let isAdmin;
    if (userRole === "ADMIN") {
        isAdmin = true;
    } else {
        isAdmin = false;
    }

    cb(null, [userId, isAdmin]);
});

passport.deserializeUser(function (userData, cb) {
    let ClientModel = require('./sequelize').Client;
    let UserModel = require('./sequelize').User;

    let id = userData[0];
    let isAdmin = userData[1];

    if (isAdmin) {
        UserModel
            .findAll({
                where: {id: id}
            })
            .then(users => {
                cb(null, users[0]);
            })
            .catch(reason => {
                return cb(reason);
            })
    } else {
        ClientModel
            .findAll({
                where: {id: id}
            })
            .then(users => {
                cb(null, users[0]);
            })
            .catch(reason => {
                return cb(reason);
            })
    }
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
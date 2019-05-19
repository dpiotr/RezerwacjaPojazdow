let express = require('express');
let passport = require('passport');

let router = express.Router();

let AdminLoginValidator = require('../utils/AdminLoginValidator');
let ReservationUtils = require('../utils/ReservationsUtils');

let CarsModel = require('../sequelize').Car;
let ModelModel = require('../sequelize').Model;
let BrandModel = require('../sequelize').Brand;
let ReservationModel = require('../sequelize').Reservation;

router.get('/', AdminLoginValidator, function (req, res) {
    res.render('admin_index_page', {
        title: 'Witaj, ' + req.user.dataValues.login + ", jesteś zalogowany jako administrator."
    });
});

router.get('/reservations', AdminLoginValidator, function (req, res) {
    ReservationModel
        .findAll({
                order: [
                    ['id', 'DESC']
                ]
            }
        )
        .then(reservations => {
            let reservationsModel = reservations.map(function (reservation) {
                    let startDate = new Date(reservation.dataValues.start);
                    let endDate = new Date(reservation.dataValues.end);

                    return ReservationUtils.getReservationModel(
                        reservation.dataValues.id,
                        startDate.getDate() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getFullYear(),
                        endDate.getDate() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getFullYear()
                    )
                }
            );

            res.render('admin_reservations_table', {title: "Wszystkie rezerwacje", reservations: reservationsModel});

        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        });
});

router.get('/reservations/:id([0-9]+)', AdminLoginValidator, function (req, res, next) {
    let reservationId = req.params.id;

    ReservationModel
        .findAll({
            where: {id: reservationId},
        })
        .then(reservations => {
            if (reservations.length !== 1) {
                res.render('error_page', {message: "Nie znaleziono rezerwacji o id: " + reservationId});
                return;
            }

            let reservation = reservations[0];

            let startDate = new Date(reservation.dataValues.start);
            let endDate = new Date(reservation.dataValues.end);
            let carId = reservation.dataValues.carId;
            let clientId = reservation.dataValues.clientId;
            let price = reservation.dataValues.price;

            CarsModel
                .findAll({
                    where: {
                        id: carId
                    },
                    include:
                        [
                            {
                                model: ModelModel,
                                include: [
                                    BrandModel
                                ]
                            }
                        ]
                })
                .then(cars => {
                    if (cars.length !== 1) {
                        res.render('error_page', {message: "Wystąpił błąd z pobieraniem pojazdu."})
                    }

                    let car = cars[0];

                    res.render('admin_reservation_details', {
                        title: "Szczegóły rezerwacji",
                        reservation: {
                            clientId: clientId,
                            car: car.dataValues.model.dataValues.brand.dataValues.name + " " + car.dataValues.model.dataValues.name,
                            image: car.dataValues.image,
                            registration_no: car.dataValues.registration_no,
                            period: startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear() + " - " + endDate.getDate() + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
                            id: reservation.dataValues.id,
                            price: price
                        }
                    })
                })
                .catch(reason => {
                    res.render('error_page', {message: reason.message})
                });
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.get('/reservations/:id([0-9]+)/remove', AdminLoginValidator, function (req, res, next) {
    let reservationId = req.params.id;
    let userId = req.user.dataValues.id;

    ReservationModel
        .findAll({
            where: {
                id: reservationId
            }
        })
        .then(reservations => {
            if (reservations.length !== 1) {
                res.render('error_page', {message: "Wystąpił błąd z pobieraniem rezerwacji."})
            }

            ReservationModel
                .destroy({
                    where: {
                        id: reservationId
                    }
                })
                .then(data => {
                    res.redirect("/administration/reservations");
                })
                .catch(reason => {
                    res.render('error_page', {message: reason.message});
                });
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.get('/reservations/:id([0-9]+)/edit', AdminLoginValidator, function (req, res, next) {
    let reservationId = req.params.id;

    ReservationModel
        .findAll({
            where: {
                id: reservationId
            }
        })
        .then(reservations => {
            if (reservations.length !== 1) {
                res.render('error_page', {message: "Wystąpił bład przy pobieraniu rezerwacji."})
            }

            let reservation = reservations[0];

            let startDate = new Date(reservation.start);
            let endDate = new Date(reservation.end);
            let carId = reservation.carId;
            let price = reservation.price;

            CarsModel
                .findAll({
                    where: {
                        id: carId
                    },
                    include:
                        [
                            {
                                model: ModelModel,
                                include: [
                                    BrandModel
                                ]
                            }
                        ]
                })
                .then(cars => {
                    if (cars.length !== 1) {
                        res.render('error_page', {message: "Wystąpił błąd z pobieraniem pojazdu."})
                    }

                    let car = cars[0];

                    res.render('admin_reservation_modify', {
                        reservation: {
                            car: car.dataValues.model.dataValues.brand.dataValues.name + " " + car.dataValues.model.dataValues.name,
                            image: car.dataValues.image,
                            registration_no: car.dataValues.registration_no,
                            start: startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate(),
                            end: endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate(),
                            period: startDate.getDate() + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear() + " - " + endDate.getDate() + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
                            id: reservation.id,
                            carId: car.id,
                            price: price
                        }
                    })
                })
                .catch(reason => {
                    res.render('error_page', {message: reason.message})
                });
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.post('/reservations/:id([0-9]+)/edit', AdminLoginValidator, function (req, res, next) {
    const oneDay = 24 * 60 * 60 * 1000;

    let reservationId = req.params.id;

    let carId = req.body.carId;
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);

    let days = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay))) + 1;

    ReservationModel
        .findAll({
            where: {
                carId: carId
            }
        })
        .then(reservations => {
            for (let i in reservations) {
                let r = reservations[i];

                if (r.id.toString() === reservationId.toString()) {
                    continue;
                }

                let sDate = new Date(r.dataValues.start);
                let eDate = new Date(r.dataValues.end);
                let eEDate = new Date(eDate.getTime() + oneDay - 1);

                if (startDate.getTime() >= sDate.getTime() && startDate.getTime() <= eEDate.getTime()) {
                    res.render('error_page', {message: "Przepraszamy, w tym czasie wybrany pojazd jest niedostępny. Spróbuj innego terminu"});
                    return;
                }

                if (endDate.getTime() >= sDate.getTime() && endDate.getTime() <= eEDate.getTime()) {
                    res.render('error_page', {message: "Przepraszamy, w tym czasie wybrany pojazd jest niedostępny. Spróbuj innego terminu"});
                    return;
                }
            }

            CarsModel
                .findAll({
                    where: {id: carId}
                })
                .then(cars => {
                    if (cars.length !== 1) {
                        res.render('error_page', {message: "Nie znaleziono pojazdu o id: " + carId});
                        return;
                    }

                    let car = cars[0];

                    ReservationModel
                        .update(
                            {
                                start: startDate.getTime(),
                                end: endDate.getTime(),
                                price: car.dataValues.price * days,
                            },
                            {
                                where: {id: reservationId}
                            })
                        .then(value => {
                            res.redirect("/administration/reservations")
                        })
                        .catch(reason => {
                            res.render('error_page', {message: reason.message})
                        });
                })
                .catch(reason => {
                    res.render('error_page', {message: reason.message})
                });
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
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
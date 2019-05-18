let express = require('express');
let router = express.Router();

let LoginValidator = require('../utils/LoginValidator');
let ReservationUtils = require('../utils/ReservationsUtils');

let CarsModel = require('../sequelize').Car;
let ModelModel = require('../sequelize').Model;
let BrandModel = require('../sequelize').Brand;
let ReservationModel = require('../sequelize').Reservation;

router.get('/', LoginValidator, function (req, res, next) {
    let userId = req.user.dataValues.id;

    ReservationModel
        .findAll({
                where: {clientId: userId},
                order: [
                    ['start', 'DESC']
                ]
            }
        )
        .then(reservations => {
            let reservationsModel = reservations.map(function (reservation) {
                    let startDate = new Date(reservation.dataValues.start * 1000);
                    let endDate = new Date(reservation.dataValues.end * 1000);

                    return ReservationUtils.getReservationModel(
                        reservation.dataValues.id,
                        startDate.getDate() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getFullYear(),
                        endDate.getDate() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getFullYear()
                    )
                }
            );

            res.render('reservations_table', {title: "Twoje rezerwacje", reservations: reservationsModel})
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        });
});

router.get('/:id([0-9]+)', LoginValidator, function (req, res, next) {
    let reservationId = req.params.id;
    let userId = req.user.dataValues.id;

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

            let startDate = new Date(reservation.dataValues.start * 1000);
            let endDate = new Date(reservation.dataValues.end * 1000);
            let carId = reservation.dataValues.carId;
            let clientId = reservation.dataValues.clientId;
            let price = reservation.dataValues.price;

            if (clientId !== userId) {
                res.render('error_page', {message: "Nie możesz wyświetlić rezerwacji która nie została przez Ciebie stworzona."})
            }

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

                    res.render('reservation_details', {
                        title: "Szczegóły rezerwacji",
                        reservation: {
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


router.post('/', LoginValidator, function (req, res, next) {
    const oneDay = 24 * 60 * 60 * 1000;

    let carId = req.body.carId;
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);

    let days = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay))) + 1;

    CarsModel
        .findAll({
            where: {id: carId},
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
        .then(car => {
            if (car.length !== 1) {
                res.render('error_page', {message: "Nie znaleziono pojazdu o id: " + carId});
                return;
            }

            ReservationModel
                .findAll()
                .then(reservations => {
                    res.render('car_details', {title: "Szczegóły pojazdu", car: car[0]})

                })
                .catch(error => {

                });

        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

module.exports = router;
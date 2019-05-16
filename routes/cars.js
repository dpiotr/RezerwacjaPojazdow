let express = require('express');
let router = express.Router();

let LoginValidator = require('../utils/LoginValidator');

let CarsModel = require('../sequelize').Car;
let ModelModel = require('../sequelize').Model;
let BrandModel = require('../sequelize').Brand;

router.get('/', LoginValidator, function (req, res, next) {
    CarsModel
        .findAll({
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
            res.render('cars_table', {title: "Nasze pojazdy", cars: cars})
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.get('/:id([0-9]+)', LoginValidator, function (req, res, next) {
    let carId = req.params.id;

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

            res.render('car_details', {title: "Szczegóły pojazdu", car: car[0]})
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

router.get('/:id([0-9]+)/reservation', LoginValidator, function (req, res, next) {
    let carId = req.params.id;

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

            res.render('car_reservation', {title: "Rezerwacja pojazdu", car: car[0]})
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

module.exports = router;
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
            res.render('cars_table', {title: "Nasze pojazdy", users: cars})
        })
        .catch(reason => {
            res.render('error_page', {message: reason.message})
        })
});

module.exports = router;
var express = require('express');
var router = express.Router();

const ClientModel = require('../sequelize').Client;

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// // create a user
// router.post('/api/users', (req, res) => {
//   User.create(req.body)
//       .then(user => res.json(user))
// });
//
// // get all users
router.get('/api/users', (req, res) => {
    ClientModel
        .findAll(
            // {
            //     where: {login: ""}
            // }
        )
        .then(users => res.json(users))
        .catch(reason => {

        })
});

module.exports = router;
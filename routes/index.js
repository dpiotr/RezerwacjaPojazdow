var express = require('express');
var router = express.Router();

// const { User, Blog, Tag } = require('../sequelize');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// // create a user
// router.post('/api/users', (req, res) => {
//   User.create(req.body)
//       .then(user => res.json(user))
// });
//
// // get all users
// router.get('/api/users', (req, res) => {
//   User.findAll().then(users => res.json(users))
// });

module.exports = router;

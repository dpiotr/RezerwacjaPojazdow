let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index_page', {
        title: 'Witaj na stronie naszej wypożyczalni.',
        description: "Aby w pełni korzystać z naszej oferty musisz się zalogować."
    });
});

// // create a user
// router.post('/api/users', (req, res) => {
//   User.create(req.body)
//       .then(user => res.json(user))
// });
//
// // get all users

module.exports = router;
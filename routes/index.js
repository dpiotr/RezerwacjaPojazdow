let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
    if (req.user != null) {
        res.render('index_page', {
            title: 'Witaj ponownie, ' + req.user.dataValues.login
        });
    } else {
        res.render('index_page', {
            title: 'Witaj na stronie naszej wypożyczalni',
            description: "Aby w pełni korzystać z naszej oferty musisz się zalogować."
        });
    }
});

module.exports = router;
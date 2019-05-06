function isAuthenticated(req, res, next) {
    if (req.user != null) {
        return next();
    } else {
        res.render('login_required');
    }
}

module.exports = isAuthenticated;
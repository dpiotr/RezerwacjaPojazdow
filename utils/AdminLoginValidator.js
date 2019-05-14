function isAdminAuthenticated(req, res, next) {
    if (req.user != null && req.user.role === "ADMIN") {
        return next();
    } else {
        res.render('login_admin_required');
    }
}

module.exports = isAdminAuthenticated;
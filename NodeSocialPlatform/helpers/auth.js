module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    ensureOwner: (req, res, next) => {
        if (req.params.id == res.locals.user._id) {
            return next();
        }
        res.redirect(`/user/${res.locals.user._id}/profile`);
    },
    ensureAuthorised: (req, res, next) => {
        if (res.locals.user.isAdmin == 1) {
            return next();
        }

        req.flash('error', 'Not Authorised')
        res.redirect('/dashboard');
    },
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/home');
        } else {
            return next();
        }
    }
};
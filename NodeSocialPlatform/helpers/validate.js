'use stict';

module.exports = function() {
    return {
        registration: (req, res, next) => {
            req.checkBody('username', 'Name field is required').notEmpty();
            req.checkBody('username', 'Name cannot be less than 4 characters').notEmpty().isLength({ min: 5 });
            req.checkBody('email', 'Email field is required').notEmpty();
            req.checkBody('email', 'Not a valid email').isEmail();
            req.checkBody('password', 'Password field is required').notEmpty();
            req.checkBody('password', 'Password cannot be less than 6 characters').notEmpty().isLength({ min: 6 });

            req.getValidationResult()
                .then(result => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach(error => {
                        messages.push(error.msg);
                    });
                    req.flash('error', messages);
                    res.redirect('/register')
                }).catch(err => {
                    return next();
                });
        },
        login: (req, res, next) => {
            req.checkBody('email', 'Email field is required').notEmpty();
            req.checkBody('email', 'Not a valid email').isEmail();
            req.checkBody('password', 'Password field is required').notEmpty();
            req.getValidationResult()
                .then(result => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach(error => {
                        messages.push(error.msg);
                    });
                    req.flash('error', messages);
                    res.redirect('/')
                }).catch(err => {
                    return next();
                });
        }
    }
};
'use strict';

module.exports = function(lodash, passport, validate, auth) {
    return {
        SetRouting: function(router) {
            router.get('/', auth.ensureGuest, this.indexPage);
            router.get('/register', auth.ensureGuest, this.getRegisterForm);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.getFacebookCallback);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.getGoogleCallback);
            router.post('/register', validate.registration, this.postRegisterForm);
            router.post('/login', validate.login, this.postLoginForm);
            router.get('/logout', this.logoutUser);
        },
        indexPage: function(req, res) {
            const errors = req.flash('error');
            return res.render('pages/index', {
                title: 'Register',
                hasErrors: errors.length > 0,
                errors: errors
            });
        },
        getRegisterForm: function(req, res) {
            const errors = req.flash('error');
            return res.render('pages/register', {
                title: 'Register',
                hasErrors: errors.length > 0,
                errors: errors
            });
        },
        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),
        getFacebookCallback: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/testing',
            failureFlash: true
        }),
        getGoogleLogin: passport.authenticate('google', {
            // scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
            scope: ['profile', 'email']
        }),
        getGoogleCallback: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/testing',
            failureFlash: true
        }),
        postRegisterForm: passport.authenticate('local.register', {
            successRedirect: '/home',
            failureRedirect: '/register',
            failureFlash: true
        }),
        postLoginForm: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        logoutUser: function(req, res) {
            req.logout();
            res.redirect('/');
        }
    }
}
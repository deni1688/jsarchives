'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (user) { return done(null, false, req.flash('error', 'User with given email already in use')); }

        const newUser = new User();
        newUser.fullname = req.body.username;
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.isAdmin = 0;


        newUser.save(err => {
            if (err) console.log(err);
            done(null, newUser);
        });
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        const messages = [];
        if (!user || !user.validPassword(password)) {
            messages.push('Email or password is invalid');
            return done(null, false, req.flash('error', messages));
        }
        return done(null, user);
    });
}));
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
User = require('../models/User');

// get register 
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register Account'
    });
});

// post new user 
router.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);


    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register Account'
        });
    } else {
        User.findOne({username: username}, (err, user) => {
            if (err) console.log(err);
            if (user) {
                req.flash('warning', 'Username is already in use.')
                res.redirect('/user/register');
            } else {
                let user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) console.log(err);
                        user.password = hash;
                        user.save((err, user) => {
                            if (err) {
                                console.log(err)
                            } else {
                                req.flash('success', 'You are now registered. Proceed to login.')
                                res.redirect('/users/login');
                            }
                        });
                    });
                });
            }
        });
    }

});

// get login
router.get('/login', (req, res) => {
    if (res.locals.user
    )
        res.redirect('/');
    res.render('login', {
        title: 'Account Login'
    });
});

// post login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// get logout
router.get('/logout', (req, res, next) => {
    req.logout();
    delete req.session.cart;
    req.flash('success', 'Logout Successful!')
    res.redirect('/users/login');
});


module.exports = router;
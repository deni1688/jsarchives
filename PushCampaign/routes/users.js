const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../helpers/auth');

// load User Model - Schema
require('../models/User');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
    User.find({}).then((users, err) => {
        if (err) {
            console.log(err);
        }
        const context = {title: "All Users", users: users};
        res.render('users/overview', context);
    });
});

// user register route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// login form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// user register route
router.get('/new', ensureAuthenticated, (req, res) => {
    const context = {title: "Register New User"};
    res.render('users/register', context);
});

// register form POST
router.post('/register', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({text: 'Passwords do not match!'});
    }

    if (req.body.password.length < 4) {
        errors.push({text: 'Password is too short! Needs to be 4 or more characters!'});
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already  in use!');
                    res.redirect('/users/new');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw error;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'New user has been registered');
                                    res.redirect('/users');
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });
                    });
                }
            });
    }
});

// get user edit view
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    User.findOne({_id: id}).then((user, err) => {
        if (err) {
            console.log(err);
        }
        if (user) {
            const context = {title: "Edit User", id: id, name: user.name, password: '', password2: ''};
            res.render('users/edit', context);
        }
    });
});

// update user
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    User.findOne({ _id: id }).then((user, err) => {
        if (err) {
            console.log(err);
        }
        if (user) {
            let errors = [];

            if (req.body.password !== req.body.password2) {
                errors.push({ text: 'Passwords do not match!' });
            }

            if (req.body.password.length < 4) {
                errors.push({ text: 'Password is too short! Needs to be 4 or more characters!' });
            }

            if (errors.length > 0) {
                res.render('users/edit', {
                    id: id,
                    errors: errors,
                    name: req.body.name,
                    password: req.body.password,
                    password2: req.body.password2
                });
            }else{
                const updateUser = new User({
                    name: req.body.name,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(updateUser.password, salt, (err, hash) => {
                        if (err) throw error;
                        updateUser.password = hash;
                        User.findByIdAndUpdate(user.id, {$set: {name: updateUser.name, password: updateUser.password}})
                            .then(user => {
                                req.flash('success_msg', `${updateUser.name} has been updated.`);
                                res.redirect('/users');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                });
            }
            
        }
    });
});


// delete user
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    if (req.user.id == id) {
        req.flash('error_msg', `You cannot delete yourself ${req.user.name}`);
        res.redirect('/users');
    } else {
        User.findByIdAndRemove({_id: id}).then((user, err) => {
            if (err) {
                console.log(err);
            }
            req.flash('success_msg', `You successfully deleted user ${user.name}`);
            res.redirect('/users');
        });
    }
});

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Yoy have logged out successfully!');
    res.redirect('/users/login');
});

module.exports = router;
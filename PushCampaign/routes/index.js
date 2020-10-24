const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');

// load User Model - Schema
require('../models/User');
const User = mongoose.model('users');

// load Website Model - Schema
require('../models/Website');
const Website = mongoose.model('websites');

// load Setting Model - Schema
require('../models/Website');
const Setting = mongoose.model('settings');

router.get('/', ensureAuthenticated, (req, res) => {
    User.find({}).then((users, err) => {
        if (err) {
            console.log(err);
        }
        Website.find({}).then((websites, err) => {
            if (err) {
                console.log(err);
            }

            const userCount = users.length;
            const websiteCount = websites.length;
            // collection all subscriptions from websites into single array
            let subs = [];
            websites.forEach(ws => {
                ws.subscribers.forEach(sub => subs.push(sub));
            });
            const context = {
                title: "Dashboard",
                userCount,
                websiteCount,
                subsCount: subs.length
            };
            res.render("index/dashboard", context);
        });
    });
});

router.get('/settings', ensureAuthenticated, (req, res) => {
    const context = {
        title: 'Settings',
    };
    res.render('index/settings', context);
});

router.post('/settings/update', ensureAuthenticated, (req, res) => {

    const brand = req.body.brandName;
    const logo = req.body.logo;
    const theme = req.body.themeOptions;
    const newTheme = req.body.newThemePath;
    const id = req.body.id;
    if(newTheme !== ''){
        req.app.locals.settings.themes.options.push(newTheme);
    }
    const newThemeSettings = {
        id: id,
        brandName: brand || req.app.locals.settings.brandName,
        themes: {
            options: req.app.locals.settings.themes.options,
            active: newTheme === ''? theme : newTheme
        },
        pathToSiteLogo: logo || req.app.locals.settings.pathToSiteLogo
    };

    Setting.findOneAndUpdate({_id: id}, {$set: newThemeSettings})
    .then((setting, err) => {
        if(err){
            console.log(err);
        }
        req.app.locals.settings = newThemeSettings;
        req.flash('success_msg', 'You have successfully updated your site settings');
        res.redirect('/settings');
    })
    .catch(err => console.log(err));

   
});

module.exports = router;
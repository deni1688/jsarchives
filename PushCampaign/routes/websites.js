const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');

// load Website Model - Schema
require('../models/Website');
const Website = mongoose.model('websites');


router.get('/', ensureAuthenticated, (req, res) => {
    Website.find({}).then((websites, err) => {
        if (err) {
            console.log(err);
        }
        const context = {
            title: 'All Websites',
            websites: websites
        };
        res.render('websites/overview', context);
    });
});

router.get('/new', ensureAuthenticated, (req, res) => {
    const context = {
        title: 'Register New Website'
    };
    res.render('websites/register', context);
});

router.post('/register', ensureAuthenticated, (req, res) => {
    let url = req.body.url;
    let name = req.body.name;

    if (url !== '' || name !== '') {
        const validPattern = new RegExp('^(?:https:\/\/)', 'g');
        const context = {
            title: 'Register New Website',
            url,
            name
        };
        if (validPattern.test(url)) {
            new Website({
                    name,
                    url
                }).save()
                .then((website, err) => {
                    if (err) {
                        console.log(err);
                    }
                    req.flash('success_msg', `${website.name} registered successfuly.`);
                    res.redirect('/websites');
                }).catch(err => console.log(err));
        } else {
            req.flash('error_msg', 'Invalid url - You must have a HTTPS protocol on your website.');
            res.render('websites/register', context);
        }
    } else {
        req.flash('error_msg', 'Both fields are required.');
        res.render('websites/register', context);
    }

});

// get website details view
router.get('/details/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const context = {
        title: "Instructions",
        id: id
    };
    res.render('websites/details', context);
});

// get website edit view
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Website.findOne({
        _id: id
    }).then((website, err) => {
        if (err) {
            console.log(err);
        }
        if (website) {
            const context = {
                title: "Edit Website",
                id: id,
                name: website.name,
                url: website.url
            };
            res.render('websites/edit', context);
        }
    });
});

// update website
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    let url = req.body.url;
    let name = req.body.name;
    
    Website.findOne({_id: id}).then((website, err) => {
        if(err){
            console.log(err);
        }
        if(website){
            if (url !== '' || name !== '') {
                const validPattern = new RegExp('^(?:https:\/\/)', 'g');
                const context = {
                    title: 'Register New Website',
                    url,
                    name,
                    id
                };
                if (validPattern.test(url)) {
                   Website.findByIdAndUpdate(website.id, {$set: {name: name, url: url}})
                   .then((website, err) => {
                       req.flash('success_msg', `${website.name} has been updated.`);
                       res.redirect('/websites');
                   })
                   .catch(err => console.log(err));
                } else {
                    req.flash('error_msg', 'Invalid url - You must have a HTTPS protocol on your website.');
                    res.render('websites/edit' + id, context);
                }
            } else {
                req.flash('error_msg', 'Both fields are required.');
                res.render('websites/edit/' + id, context);
            }
        }
    });
   

});

// delete website
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Website.findByIdAndRemove({
        _id: id
    }).then((website, err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success_msg', `You successfully deleted the ${website.name} website`);
        res.redirect('/websites');
    });
});

module.exports = router;
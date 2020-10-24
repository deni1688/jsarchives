const express = require('express');
const router = express.Router();
Page = require('../models/Page');

// get home page
router.get('/', (req, res) => {
    Page.findOne({slug: 'home'}, (err, page) => {
        if (err) console.log(err);
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });
});
// get page
router.get('/:slug', (req, res) => {
    let slug = req.params.slug;
    Page.findOne({slug: slug}, (err, page) => {
        if (err) console.log(err);
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });
});

module.exports = router;
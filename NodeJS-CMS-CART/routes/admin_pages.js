const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Page = require('../models/Page');
const auth = require('../config/auth');

// get pages index

router.get('/', auth.ensureAdmin, (req, res) => {
    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
        res.render('admin/pages', {
            pages: pages
        });
    });
});


router.get('/add-page', auth.ensureAdmin, (req, res) => {
    let formValues = {
        title: '',
        slug: '',
        content: ''
    };
    res.render('admin/add_page', formValues);
});

router.post('/add-page', (req, res) => {

    req.checkBody('title', 'Title value is required').notEmpty();
    req.checkBody('content', 'Content value is required').notEmpty();

    let title = req.body.title;
    let content = req.body.content;
    let sorting = 100;
    let slug;
    if (req.body.slug) {
        slug = req.body.slug.replace(/\s/g, '-').toLowerCase();
    } else {
        slug = req.body.title.replace(/\s/g, '-').toLowerCase();
    }


    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
        });
    } else {
        Page.findOne({slug: slug}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exists already!');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: sorting
                });
                page.save(err => {
                    if (err) console.log(err);
                    Page.find({}).sort({sorting: 1}).exec((err, pages) => {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages
                        }
                    });
                    req.flash('success', 'Page addeded!');
                    res.redirect('/admin/pages')
                });
            }
        });
    }
});


function sortPages(ids, callback) {
    let count = 0;

    for (var i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;
        // closure for async regulation
        (count => {
            Page.findById(id, (err, page) => {
                if (err) console.log(err);
                page.sorting = count;
                page.save(err => {
                    if (err) console.log(err);
                    count++;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })
        (count);
    }
}

// reorder pages by sortable 
router.post('/reorder-pages', (req, res) => {
    let ids = req.body['id[]'];

    sortPages(ids, () => {
        Page.find({}).sort({sorting: 1}).exec((err, pages) => {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages
            }
        });
    });
});

router.get('/edit-page/:id', auth.ensureAdmin, (req, res) => {
    let id = req.params.id;
    Page.findById(id, (err, page) => {
        if (err) console.log(err);
        res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});

// post updated page
router.post('/edit-page/:id', (req, res) => {

    req.checkBody('title', 'Title value is required').notEmpty();
    req.checkBody('content', 'Content value is required').notEmpty();

    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let sorting = 100;
    let slug;
    if (req.body.slug) {
        slug = req.body.slug.replace(/\s/g, '-').toLowerCase();
    } else {
        slug = req.body.title.replace(/\s/g, '-').toLowerCase();
    }

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
        });
    } else {
        Page.findOne({slug: slug, _id: {'$ne': id}}, (err, page) => {
            if (page) {
                req.flash('danger', 'Page slug exists already!');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, (err, page) => {
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    page.save(err => {
                        if (err) console.log(err);
                        Page.find({}).sort({sorting: 1}).exec((err, pages) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.pages = pages
                            }
                        });
                        req.flash('success', 'Page updated!');
                        res.redirect(`/admin/pages/edit-page/${id}`)
                    });
                });
            }
        });
    }
});

router.get('/delete-page/:id', auth.ensureAdmin, (req, res) => {
    Page.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            Page.find({}).sort({sorting: 1}).exec((err, pages) => {
                    if (err) {
                        console.log(err);
                    } else {
                        req.app.locals.pages = pages
                    }
                }
            );
            req.flash('success', 'Page Deleted!');
            res.redirect('/admin/pages')
        }
    });
});

module.exports = router;
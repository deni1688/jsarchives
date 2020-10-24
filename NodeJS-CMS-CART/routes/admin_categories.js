const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const auth = require('../config/auth');


// get categories
router.get('/', auth.ensureAdmin, (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

// get add category form
router.get('/add-category', auth.ensureAdmin, (req, res) => {
    let formValue = '';
    res.render('admin/add_category', {
        title: formValue
    });

});
// post categories
router.post('/add-category', (req, res) => {

    req.checkBody('title', 'Title value is required').notEmpty();

    let title = req.body.title;
    let slug = req.body.title.replace(/\s/g, '-').toLowerCase();
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    } else {
        Category.findOne({slug: slug}, (err, cat) => {
            if (cat) {
                req.flash('danger', 'Category exists already!');
                res.render('admin/add_category', {
                    title: title
                });
            } else {
                let category = new Category({
                    title: title,
                    slug: slug
                });
                category.save(err => {
                    if (err) console.log(err);
                    Category.find({}, (err, categories) => {
                        if (err) console.log(err);
                        req.app.locals.categories = categories;
                    });
                    req.flash('success', 'Category addeded!');
                    res.redirect('/admin/categories')
                });
            }
        });
    }
});

// get edit category form
router.get('/edit-category/:id', auth.ensureAdmin, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, cat) => {
        if (err) console.log(err);
        res.render('admin/edit_category', {
            title: cat.title,
            id: cat._id
        });
    });
});

// post edited category
router.post('/edit-category/:id', (req, res) => {

    req.checkBody('title', 'Title value is required').notEmpty();

    let id = req.params.id;
    let title = req.body.title;
    let slug = req.body.title.replace(/\s/g, '-').toLowerCase();
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findById({slug: slug, _id: {'$ne': id}}, (err, cat) => {
            if (cat) {
                req.flash('danger', 'Category exists already!');
                res.render('admin/add_page', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id).then(cat => {
                    cat.title = title;
                    cat.slug = slug;
                    cat.save(err => {
                        if (err) console.log(err);
                        Category.find({}, (err, categories) => {
                            if (err) console.log(err);
                            req.app.locals.categories = categories;
                        });
                        req.flash('success', 'Category updated!');
                        res.redirect(`/admin/categories/edit-category/${cat._id}`)
                    });
                });
            }
        });
    }
});
// delete category
router.get('/delete-category/:id', auth.ensureAdmin, (req, res) => {
    Category.findByIdAndRemove(req.params.id, err => {
        if (err) {
            console.log(err);
        } else {
            Category.find({}, (err, categories) => {
                if (err) console.log(err);
                req.app.locals.categories = categories;
            });
            req.flash('success', 'Category Deleted!');
            res.redirect('/admin/categories')
        }
    });
});

module.exports = router;
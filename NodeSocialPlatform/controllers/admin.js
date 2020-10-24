'use strict';
// const path = require('path');
// const fs = require('fs');
module.exports = function(auth, formidable, Group, User, Category, aws) {
    return {
        SetRouting: function(router) {
            router.get('/dashboard', auth.ensureAuthenticated, this.adminPage);
            router.post('/dashboard/add-group', auth.ensureAuthenticated, aws.Upload.any(), this.addGroup);
            router.post('/dashboard/add-user', auth.ensureAuthenticated, auth.ensureAuthorised, this.addUser);
            router.post('/dashboard/add-category', auth.ensureAuthenticated, this.addCategory);
        },
        adminPage: function(req, res) {
            const errors = req.flash('error');
            Category.find({}, (err, cat) => {

                if (err) console.log(err);
                User.findOne({ 'username': req.user.username })
                    .populate('requests.userId')
                    .exec((err, result) => {
                        const data = result;
                        res.render('admin/dashboard', {
                            title: 'Dashboard',
                            user: req.user,
                            hasErrors: errors.length > 0,
                            errors: errors,
                            categories: cat,
                            data: data
                        });
                    });

            });

        },
        addGroup: function(req, res) {
            const groupName = req.body.groupName;
            const groupCategory = req.body.groupCategory;
            const groupThumb = req.body.fileName;

            Group.findOne({ name: groupName }, (err, group) => {
                if (err) console.log(err);
                if (group) {
                    req.flash('error', 'Group name is already in use');
                    return res.redirect('/dashboard');
                } else {
                    const newGroup = new Group();
                    newGroup.name = groupName;
                    newGroup.category = groupCategory;
                    newGroup.logo = groupThumb;
                    newGroup.save((err, group) => {
                        if (err) console.log(err);
                        return res.redirect('/home');
                    });
                }
            });
        },
        addCategory: function(req, res) {
            const name = req.body.categoryName;
            Category.findOne({ name: name }, (err, cat) => {
                if (err) console.log(err);
                if (cat) {
                    req.flash('error', 'Category already exists');
                    return res.redirect('/dashboard');
                } else {
                    const newCategory = new Category();
                    newCategory.name = name;
                    newCategory.save((err, cat) => {
                        if (err) console.log(err);
                        return res.redirect('/dashboard');
                    });
                }
            });
        },
        addUser: function(req, res) {
            console.log(req.body.isAdmin)
        }
    }

}
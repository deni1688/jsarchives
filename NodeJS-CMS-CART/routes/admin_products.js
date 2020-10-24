const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../config/auth');

// get products 
router.get('/', auth.ensureAdmin, (req, res) => {
    let count;

    Product.count((err, c) => {
        count = c;
    });

    Product.find({}, (err, products) => {
        if (err) console.log(err);
        res.render('admin/products', {
            products: products,
            count: count
        })
    });


});

// add product form 
router.get('/add-product', auth.ensureAdmin, (req, res) => {
    Category.find({}).then(cats => {
        let formValues = {
            title: '',
            price: '',
            desc: '',
            categories: cats
        };
        res.render('admin/add_product', formValues);
    });

});
// post new product
router.post('/add-product', (req, res) => {
    let imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    req.checkBody('title', 'Title value is required').notEmpty();
    req.checkBody('desc', 'Product description is required').notEmpty();
    req.checkBody('price', 'Price is required').isDecimal();
    req.checkBody('price', 'You must upload an image for the product').isImage(imageFile);

    let title = req.body.title;
    let desc = req.body.desc;
    let price = req.body.price;
    let category = req.body.category;
    let slug = req.body.title.replace(/\s/g, '-').toLowerCase();

    let errors = req.validationErrors();

    if (errors) {
        Category.find({}).then(cats => {
            let formValues = {
                errors: errors,
                title: title,
                price: price,
                desc: desc,
                categories: cats
            };
            res.render('admin/add_product', formValues);
        });
    } else {
        Product.findOne({slug: slug}, (err, product) => {
            if (product) {
                req.flash('danger', 'Product name exists already!');
                Category.find({}, (err, cats) => {
                    if (err) console.log(err);
                    let formValues = {
                        title: title,
                        price: price,
                        desc: desc,
                        categories: cats
                    };
                    res.render('admin/add_product', formValues);
                })
                ;
            } else {
                let priceParsed = parseFloat(price).toFixed(2);
                let product = new Product({
                    title: title,
                    price: priceParsed,
                    desc: desc,
                    slug: slug,
                    category: category,
                    image: imageFile
                });
                product.save((err, product) => {
                    if (err) console.log('Product was not saved, following error occured: ', err);
                    mkdirp(`public/product_images/${product._id}`, err => {
                        if (err) console.log(err);
                    })
                    ;
                    mkdirp(`public/product_images/${product._id}/gallery`, err => {
                        if (err) console.log(err);
                    })
                    ;
                    mkdirp(`public/product_images/${product._id}/gallery/thumbs`, err => {
                        if (err) console.log(err);
                    })
                    ;
                    if (imageFile != '') {

                        let productImage = req.files.image;
                        let path = `public/product_images/${product._id}/${imageFile}`;
                        productImage.mv(path, err => {
                            if (err) console.log(err);
                        })
                        ;
                    }
                    req.flash('success', 'Product addeded!');
                    res.redirect('/admin/products');
                });
            }
        });
    }
});


// get edit product form
router.get('/edit-product/:id', auth.ensureAdmin, (req, res) => {

    let errors = [];

    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    Category.find({}, (err, cats) => {
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                let galleryDir = `public/product_images/${product._id}/gallery`;
                let galleryImages = null;

                fs.readdir(galleryDir, (err, files) => {
                    if (err) {
                        console.log(err)
                    } else {
                        galleryImages = files;
                        let formValues = {
                            errors: errors,
                            id: product._id,
                            title: product.title,
                            price: parseFloat(product.price).toFixed(2),
                            desc: product.desc,
                            image: product.image,
                            category: product.category.replace(/\s+/g, '-').toLowerCase(),
                            galleryImages: galleryImages,
                            categories: cats
                        };
                        res.render('admin/edit_product', formValues);
                    }
                });
            }
        })
    });

});
// post edited product
router.post('/edit-product/:id', (req, res) => {
    let imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    req.checkBody('title', 'Title value is required').notEmpty();
    req.checkBody('desc', 'Product description is required').notEmpty();
    req.checkBody('price', 'Price is required').isDecimal();
    req.checkBody('price', 'You must upload an image for the product').isImage(imageFile);

    let id = req.params.id;
    let title = req.body.title;
    let desc = req.body.desc;
    let price = req.body.price;
    let category = req.body.category;
    let slug = req.body.title.replace(/\s/g, '-').toLowerCase();
    let pImage = req.body.pImage;
    let errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect(`/admin/products/edit-product/${id}`);
    } else {
        Product.findOne({slug: slug, _id: {'$ne': id}}, (err, product) => {
            if (err) console.log(err);
            if (product) {
                req.flash('danger', 'Product name exists already!');
                res.redirect(`/admin/products/edit-product/${id}`);
            } else {
                Product.findById(id, (err, product) => {
                    if (err) console.log(err);
                    product.title = title;
                    product.slug = slug;
                    product.desc = desc;
                    product.price = parseFloat(price).toFixed(2);
                    product.category = category;
                    if (imageFile !== '') {
                        product.image = imageFile
                    }

                    product.save(err => {
                        if (err) console.log(err);
                        if (imageFile !== '') {
                            if (req.body.pImage !== '') {
                                fs.remove(`public/product_images/${id}/${req.body.pImage}`, (err) => {
                                    if (err) console.log(err);
                                })
                                ;
                            }
                            let pImage = req.files.image;
                            let path = `public/product_images/${id}/${imageFile}`;
                            pImage.mv(path, err => {
                                if (err) console.log(err);
                            });
                        }
                        req.flash('success', 'Product updated!');
                        res.redirect(`/admin/products/edit-product/${id}`);
                    })
                })
                ;
            }
        });
    }
});
// Post product gallery
router.post('/product-gallery/:id', (req, res) => {
    let productImage = req.files.file;
    let id = req.params.id;
    let path = `public/product_images/${id}/gallery/${productImage.name}`;
    let thumbsPath = `public/product_images/${id}/gallery/thumbs/${productImage.name}`;

    productImage.mv(path, err => {
        if (err) console.log(err);
        resizeImg(fs.readFileSync(path), {
            width: 100,
            height: 100
        }).then(buf => {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);
});

// delete product
router.get('/delete-image/:image', auth.ensureAdmin, (req, res) => {
    let originalImage = `public/product_images/${req.query.id}/gallery/${req.params.image}`;
    let thumbImage = `public/product_images/${req.query.id}/gallery/thumbs/${req.params.image}`;
    fs.remove(originalImage, err => {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, err => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Image Deleted!');
                    res.redirect(`/admin/products/edit-product/${req.query.id}`);
                }
            })
        }

    })
});


// delete product
router.get('/delete-product/:id', auth.ensureAdmin, (req, res) => {
    let id = req.params.id;
    let path = `public/product_images/${id}`;

    fs.remove(path, err => {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndRemove(id, err => {
                if (err) console.log(err);
                req.flash('success', 'Product deleted!');
                res.redirect('/admin/products');
            });
        }
    })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const auth = require('../config/auth');

// models
Product = require('../models/Product');
Category = require('../models/Category');


// get all products
router.get('/', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) console.log(err);
        res.render('all_products', {
            title: 'All Products',
            products: products
        });
    });
});

// get products by category
router.get('/:category', (req, res) => {
    let categorySlug = req.params.category;
    Category.findOne({slug: categorySlug}, (err, cat) => {
        if (err) console.log(err);
        Product.find({category: categorySlug}, (err, products) => {
            if (err) console.log(err);
            res.render('cat_products', {
                title: cat.title,
                products: products
            });
        });
    })

});

// get products details
router.get('/:category/:product', (req, res) => {
    let productSlug = req.params.product;
    let galleryImages = null;
    let loggedIn = req.isAuthenticated();

    Product.findOne({slug: productSlug}, (err, product) => {
        if (err) {
            console.log(err);
        } else {
            let galleryDir = `public/product_images/${product._id}/gallery`;
            fs.readdir(galleryDir, (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;
                    res.render('product', {
                        loggedIn: loggedIn,
                        title: product.title,
                        product: product,
                        galleryImages: galleryImages
                    });
                }
            });
        }
    });

});

module.exports = router;
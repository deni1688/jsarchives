const express = require('express');
const router = express.Router();
Product = require('../models/Product');

// get home page
router.get('/add/:product', (req, res) => {

    let productSlug = req.params.product;
    Product.findOne({slug: productSlug}, (err, product) => {
        if (err) console.log(err);

        if (typeof req.session.cart == 'undefined') {
            req.session.cart = [];
            req.session.cart.push({
                title: productSlug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: `/product_images/${product._id}/${product.image}`
            });
        } else {
            let cart = req.session.cart;
            let newItem = true;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title == productSlug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: productSlug,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: `/product_images/${product._id}/${product.image}`
                });
            }
        }
        req.flash('success', 'Product added');
        res.redirect('back');
    });
});

// get checkout
router.get('/checkout', (req, res) => {
    res.render('checkout', {
        title: 'Checkout',
        cart: req.session.cart
    });
});

// update checkout
router.get('/update/:product', (req, res) => {
    let productSlug = req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == productSlug) {
            switch (action) {
                case 'add':
                    cart[i].qty++;
                    break;
                case 'remove':
                    cart[i].qty--;
                    break;
                case 'clear':
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success', 'Shopping cart updated.');
    res.redirect('/cart/checkout');

});
// clear cart
router.get('/clear', (req, res) => {
    delete req.session.cart;
    req.flash('success', 'Shopping cart cleared.');
    res.redirect('/cart/checkout');
});

// check out with paypal
router.get('/paypal-checkout', (req, res) => {
    delete req.session.cart;
    res.sendStatus(200);
});

module.exports = router;
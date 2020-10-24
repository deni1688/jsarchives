const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const wp = require('web-push');
const config = require('../config/keys');
const { ensureAuthenticated } = require('../helpers/auth');

wp.setVapidDetails(
  'mailto:denisj@in-motus.com',
  config.vapidKeys.publicKey,
  config.vapidKeys.privateKey
);

// load Website Model - Schema
require('../models/Website');
const Website = mongoose.model('websites');

router.get('/', ensureAuthenticated, async (req, res) => {
  const context = {
    title: 'Push Campaigns'
  };
  const websites = await Website.find();
  const subscription = websites[0].subscribers[1].subscription;
  wp
    .sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test',
        body: 'This is a test',
        icon: 'http://placehold.it/50x50',
        tag: 'https://in-motus.com',
        campaignId: '1234'
      })
    )
    .then(() => console.log('Sent'))
    .catch(err => console.log('Could not send:', err.statusCode));
  res.render('campaigns/overview', context);
});

router.post('/', (req, res) => {
  console.log(req.body);
});

module.exports = router;

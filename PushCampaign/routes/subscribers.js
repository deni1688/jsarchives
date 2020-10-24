const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  ensureAuthenticated
} = require("../helpers/auth");

// load Website Model - Schema
require("../models/Website");
const Website = mongoose.model("websites");


router.get("/", ensureAuthenticated, (req, res) => {
  Website.find({}).then((websites, err) => {
    if (err) {
      console.log(err);
    }
    // collection all subscriptions from websites into single array
    let data = [];
    websites.forEach(ws => {
      ws.subscribers.forEach(sub => data.push({subscriber: sub, websiteId: ws.id, websiteUrl: ws.url }));
    });
    const context = {
      title: "All Subscribers",
      data: data
    };
    res.render("subscribers/overview", context);
  }).catch(err => console.log(err));
});

// save subscriber to database
router.post("/save/:id", (req, res) => {
  const id = req.params.id;
  if (req.body.subscription.endpoint !== "") {
    const newSubscriber = {
      subscription: req.body.subscription,
      isMobile: req.body.isMobile,
      date: Date.now()
    };
    Website.update({_id: id}, {$push: { subscribers: newSubscriber }})
    .then((website, err) => {
      if (err) {
        console.log(err);
      }
      res.setHeader("Content-Type", "application/json");
      res.send(
        JSON.stringify({
          data: {
            success: true
          }
        })
      );
    }).catch(err => console.log(err));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
      data: {
        success: false
      }
    }));
  }
});

// update subscribers array in website
router.post('/update/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  const websiteId = req.body.websiteId; 
  Website.update(
    { _id: websiteId }, 
    { $pull: { subscribers: {_id: id}}})
    .then((website, err) => {
    if (err) {  
      console.log(err);
    }
    req.flash('success_msg', `You successfully deleted a subscriber`);
    res.redirect('/subscribers');
    }).catch(err => console.log(err));
});

module.exports = router;
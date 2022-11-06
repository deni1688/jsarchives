const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load User model
const User = require("../../models/User");
// load Profile model
const Profile = require("../../models/Profile");

// load validation for profile inputs
const validateProfileInput = require("../../validation/profile");
// load validation for profile inputs
const validateExperienceInput = require("../../validation/experience");
// load validation for profile inputs
const validateEducationInput = require("../../validation/education");

/*
* @route   GET api/profile
* @desc    Get current users profile
* @access  Private
*/
router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const errors = {};
		// get logged in user info from jwt payload user id
		Profile.findOne({ user: req.user.id })
			.populate("user", ["name", "avatar"]) // join user data into profile data
			.then(profile => {
				if (!profile) {
					errors.noProfile = "There is no profile for this user";
					return res.status(404).json(errors);
				}
				res.json(profile);
			})
			.catch(err => res.status(404).json(err));
	}
);

/*
* @route   GET api/profile/handle/:handle
* @desc    Get profile by handle
* @access  Public
*/
router.get("/handle/:handle", (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate("user", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.noProfile = "There is no profile for this user";
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(errors));
});

/*
* @route   GET api/profile/user/:user_id
* @desc    Get profile by handle
* @access  Public
*/
router.get("/user/:user_id", (req, res) => {
	const errors = {};
	Profile.findOne({ user: req.params.user_id })
		.populate("user", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.noProfile = "There is no profile for this user";
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(errors));
});

/*
* @route   GET api/profile/all
* @desc    Get all profiles
* @access  Public
*/
router.get("/all", (req, res) => {
	const errors = {};
	Profile.find({})
		.populate("user", ["name", "avatar"])
		.then(profiles => {
			if (!profiles) {
				errors.noProfiles = "There are no profiles";
				res.status(404).json(errors);
			}
			res.json(profiles);
		})
		.catch(err => res.status(404).json(errors));
});

/*
* @route   POST api/profile
* @desc    Create or edit user profile
* @access  Private
*/
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// return errors if validation errors
		if (!isValid) {
			return res.status(400).json(errors);
		}

		// get fields
		const profileFields = {};
		profileFields.user = req.user.id; // user data from jwt payload
		if (req.body.handle) profileFields.handle = req.body.handle;
		if (req.body.company) profileFields.company = req.body.company;
		if (req.body.website) profileFields.website = req.body.website;
		if (req.body.location) profileFields.location = req.body.location;
		if (req.body.bio) profileFields.bio = req.body.bio;
		if (req.body.status) profileFields.status = req.body.status;
		if (req.body.github) profileFields.github = req.body.github;
		// split skills string by ',' into array
		if (typeof req.body.skills !== "undefined") {
			profileFields.skills = req.body.skills
				.split(",")
				.map(skill => skill.trim());
		}
		// init empty object to inject social media strings
		profileFields.social = {};
		if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
		if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
		if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
		if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
		if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// edit profile
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => res.json(profile));
			} else {
				// Create profile
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					// Check if handle exists
					if (profile) {
						errors.handle = "That handle already exists";
						res.status(400).json(errors);
					}

					// Save profile
					new Profile(profileFields)
						.save()
						.then(profile => res.json(profile))
						.catch(err => console.log(err));
				});
			}
		});
	}
);

/*
* @route   POST api/profile/experience
* @desc    Add experience to profile
* @access  Private
*/
router.post(
	"/experience",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		// return errors if validation errors
		if (!isValid) {
			return res.status(400).json(errors);
		}
		Profile.findOne({ user: req.user.id }).then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				desc: req.body.desc
			};

			// Add to experience array in user profile
			profile.experience.unshift(newExp);
			profile.save().then(profile => res.json(profile));
		});
	}
);

/*
* @route   POST api/profile/education
* @desc    Add education to profile
* @access  Private
*/
router.post(
	"/education",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateEducationInput(req.body);

		// return errors if validation errors
		if (!isValid) {
			return res.status(400).json(errors);
		}
		Profile.findOne({ user: req.user.id }).then(profile => {
			const newEdu = {
				school: req.body.school,
				fieldOfStudy: req.body.fieldOfStudy,
				degree: req.body.degree,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				desc: req.body.desc
			};

			// Add to education array in user profile
			profile.education.unshift(newEdu);
			profile.save().then(profile => res.json(profile));
		});
	}
);

/*
* @route   DELETE api/profile/experience
* @desc    Delete experience from  profile
* @access  Private
*/
router.delete(
	"/experience/:exp_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// Delete experience in user profile
				const removeIndex = profile.experience
					.map(item => item.id)
					.indexOf(req.params.exp_id);
				// remove from experience
				profile.experience.splice(removeIndex, 1);

				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

/*
* @route   DELETE api/profile/education
* @desc    Delete education from  profile
* @access  Private
*/
router.delete(
	"/education/:edu_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// Delete education in user profile
				const removeIndex = profile.education
					.map(item => item.id)
					.indexOf(req.params.exp_id);
				// remove from education
				profile.education.splice(removeIndex, 1);
				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

/*
* @route   DELETE api/profile
* @desc    Delete user and profile
* @access  Private
*/
router.delete(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOneAndRemove({ user: req.user.id }).then(() => {
			User.findOneAndRemove({ _id: req.user.id }).then(() =>
				res.json({ success: true })
			);
		});
	}
);

module.exports = router;

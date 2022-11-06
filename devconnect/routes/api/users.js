const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// load User model
const User = require("../../models/User");

// load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/*
 * @route   GET api/users/register
 * @desc    Register user
 * @access  Public
 */
router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	// verify that user is not already registerd
	// NOTE - This will not run if other errors are present in the req.body
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			errors.email = "Email already registered";
			return res.status(400).json(errors);
		} else {
			// get the gravater associated with email
			const avatar = gravatar.url(req.body.email, {
				s: "200",
				r: "pg",
				d: "mm"
			});

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});

			// hash password and add new user to db
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

/*
 * @route   POST api/users/login
 * @desc    Login user and return jwt token
 * @access  Public
 */
router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	// find user
	User.findOne({ email }).then(user => {
		if (!user) {
			errors.email = "User not found";
			return res.status(404).json(errors);
		}

		// user exists - validate password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// jwt payload
				const payload = {
					id: user.id,
					name: user.name,
					avatar: user.avatar
				};

				// sign new token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{ expiresIn: 86400 },
					(err, token) => {
						res.json({
							success: true,
							token: `Bearer ${token}`
						});
					}
				);
			} else {
				errors.password = "Password incorrect";
				return res.status(400).json(errors);
			}
		});
	});
});

/*
 * @route   GET api/users/current
 * @desc    return current user
 * @access  Private
 */
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
	}
);

module.exports = router;

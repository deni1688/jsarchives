const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load User model
const Post = require("../../models/Post");
// load User model
const Profile = require("../../models/Profile");

// load validation for post inputs
const validatePostInput = require("../../validation/post");

/*
 * @route   GET api/posts
 * @desc    Get Posts
 * @access  Public
 */
router.get("/", (req, res) => {
	const errors = {};
	Post.find({})
		.sort({ date: -1 })
		.then(posts => {
			if (!posts) {
				errors.noPosts = "No posts found";
				return res.status(404).json(errors);
			}
			res.json(posts);
		})
		.catch(err => res.status(404).json({ noPosts: "No posts found" }));
});

/*
 * @route   GET api/posts/:id
 * @desc    Get Post by id
 * @access  Public
 */
router.get("/:id", (req, res) => {
	const errors = {};
	Post.findById(req.params.id)
		.then(post => {
			if (!post) {
				errors.noPost = "That post does not exist";
				return res.status(404).json(errors);
			}
			res.json(post);
		})
		.catch(err =>
			res.status(404).json({ noPost: "That post does not exist" })
		);
});

/*
 * @route   POST api/posts
 * @desc    Create Post
 * @access  Private
 */
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		// return errors if validation errors
		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		});

		newPost.save().then(post => res.json(post));
	}
);

/*
 * @route   DELETE api/posts/:id
 * @desc    Delete Post by id
 * @access  Private
 */
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					// verify post owner
					if (post.user.toString() !== req.user.id) {
						return res
							.status(401)
							.json({ notAuthorized: "User not authorized" });
					}

					post.remove().then(() => res.json({ success: true }));
				})
				.catch(err =>
					res.status(404).json({ noPost: "Post not found" })
				);
		});
	}
);

/*
 * @route   UPDATE api/posts/like/:id
 * @desc    Like Post by id
 * @access  Private
 */
router.put(
	"/like/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(
							like => like.user.toString() === req.user.id
						).length > 0
					) {
						return res.status(400).json({
							alreadyLiked: "User already liked this post"
						});
					}
					// Add user id to post likes
					post.likes.unshift({ user: req.user.id });
					post.save().then(post => res.json(post));
				})
				.catch(err =>
					res.status(404).json({ noPost: "Post not found" })
				);
		});
	}
);

/*
 * @route   UPDATE api/posts/unlike/:id
 * @desc    Like Post by id
 * @access  Private 
 */
router.put(
	"/unlike/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(
							like => like.user.toString() === req.user.id
						).length === 0
					) {
						return res
							.status(400)
							.json({ noLike: "Post not liked yet" });
					}
					// Remove user id from post likes
					const removeIndex = post.likes
						.map(item => item.user.toString())
						.indexOf(req.user.id);
					post.likes.splice(removeIndex, 1);

					post.save().then(() => res.json(post));
				})
				.catch(err =>
					res.status(404).json({ noPost: "Post not found" })
				);
		});
	}
);

/*
 * @route   POST api/posts/comment/:id
 * @desc    Add comment to post
 * @access  Private 
 */
router.post(
	"/comment/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		// return errors if validation errors
		if (!isValid) {
			return res.status(400).json(errors);
		}

		Post.findById(req.params.id).then(post => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			};

			// Add to post comments
			post.comments.unshift(newComment);

			post
				.save()
				.then(post => res.json(post))
				.catch(err =>
					res.status(404).json({ noPost: "No post found" })
				);
		});
	}
);

/*
 * @route   DELETE api/posts/comment/:id/cooment_id
 * @desc    Delete comment from post
 * @access  Private 
 */
router.delete(
	"/comment/:id/:comment_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.id).then(post => {
			// delete comment form post comments if it exists
			if (
				post.comments.filter(
					comment => comment._id.toString() === req.params.comment_id
				).length === 0
			) {
				return res
					.status(404)
					.json({ noComment: "Comment does not exist" });
			}

			// Get index of item to remove from comment array
			const removeIndex = post.comments
				.map(item => item._id.toString())
				.indexOf(req.params.comment_id);
			// remove from post comments array
			post.comments.splice(removeIndex, 1);

			post
				.save()
				.then(post => res.json(post))
				.catch(err =>
					res.status(404).json({ noPost: "No post found" })
				);
		});
	}
);

module.exports = router;

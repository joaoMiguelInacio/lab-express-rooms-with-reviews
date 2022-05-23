const router = require("express").Router();
const mongoose = require("mongoose");

const isLoggedIn = require("../middleware/isLoggedIn.js");

const User = require ("../models/User.model.js");
const Review = require("../models/Review.model.js");
const Room = require("../models/Room.model.js");

//See full list of reviwes
router.get('/reviews-list', async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate("owner reviews")
      .populate({
        path: "reviews",
        populate:{
          path: "user"
      }
    });
    res.render('reviews/reviews-list', {rooms});
  } catch (err) {
    next(err);
  }
});

//See full list of OWN reviews, only accessible to users logged in.
router.get('/own-reviews-list', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const reviews = await Review.find({ user : userId});
    res.render('reviews/own-reviews-list', {reviews});
  } catch (err) {
    next(err);
  }
});

//Edit OWN reviews
//no need for middleware to protect reviews because own reviews are only accessible to the user logged in
router.get('/:id/reviews-edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById (id);
    res.render ('reviews/reviews-edit', review);
  } catch(error){
    next(error);
  }
});

//no need for middleware to protect reviews because own reviews are only accessible to the user logged in
router.post('/:id/reviews-edit', async (req, res, next) => {
  try {
		const { id } = req.params;
		const { comment } = req.body;
		await Review.findByIdAndUpdate(id, { comment }, { new: true });
		res.redirect("/reviews/own-reviews-list");
	} catch(error){
		next(error);
	}
});

//Delete OWN reviews
//no need for middleware to protect reviews because own reviews are only accessible to the user logged in
router.post('/:id/reviews-delete', async (req, res, next) => {
  try {
		const { id } = req.params;
		await Review.findByIdAndDelete(id);
    res.redirect("/reviews/own-reviews-list");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
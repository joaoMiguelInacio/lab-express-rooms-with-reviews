const express = require('express');
const router = express.Router();
const Review = require("../models/Review.model.js");

router.get('/reviews-list', async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user');
    res.render('reviews/reviews-list', {reviews});
  } catch (err) {
    next(err);
  }
});

router.get('/:id/reviews-edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById (id);
    res.render ('reviews/reviews-edit', review);
  } catch(error){
    next(error);
  }
});

//missing middleware so that only owner can edit own review
//redirect to room details page and not to rooms-list or reviews-list
router.post('/:id/reviews-edit', async (req, res, next) => {
  try {
		const { id } = req.params;
		const { comment } = req.body;
		await Review.findByIdAndUpdate(id, { comment }, { new: true });
		res.redirect("/rooms/rooms-list");
	} catch(error){
		next(error);
	}
});

//missing middleware so that only owner can delete own review
//redirect to room details page and not to rooms-list or reviews-list
router.post('/:id/reviews-delete', async (req, res, next) => {
  try {
		const { id } = req.params;
		await Review.findByIdAndDelete(id);
    res.redirect("/rooms/rooms-list");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
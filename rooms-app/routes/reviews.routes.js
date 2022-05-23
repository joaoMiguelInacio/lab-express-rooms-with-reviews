/*

//Create Review

//no need for middleware as only logged in users who are not owners will have access to the view with the review button
router.get('/:id/reviews-create', async(req, res, next) => {
  const {id} = req.params;
  const room = await Room.findById(id);
  res.render('room/reviews-create', room);
});

router.post('/:id/create-review-url', async (req, res, next) => {
  try{
      const { content } = req.body;
      const { id } = req.params;
      const newReview = await Review.create ({
         content: content,
         movie: id
      });
      const newReviewId = newReview._id;
      await Movie.findByIdAndUpdate(id, { $addToSet: { reviews: newReviewId } });
      res.redirect(`/movie/${id}/details-url`); 
  } catch (error) {
      next (error);
  }
});

*/
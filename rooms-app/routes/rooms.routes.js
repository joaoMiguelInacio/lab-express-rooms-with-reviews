const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const Room = require("../models/Room.model.js");

//will show the list of rooms, EVERYONE CAN SEE
router.get('/rooms-list', async (req, res, next) => {
  
  try {
    const rooms = await Room.find();
    res.render('rooms/rooms-list', {rooms});
  } catch (err) {
    next(err);
  }
});

//will get the create a room view, USER NEEDS TO BE LOGGED IN
router.get('/rooms-create', isLoggedIn, (req, res, next) => {
  res.render('rooms/rooms-create');
});

router.post('/create', async (req, res, next) => {
  try {
    const { name, description, imageUrl} = req.body;
    await Room.create({
      name, 
      description,
      imageUrl,
      //missing owners and reviews
    });
    res.redirect("/rooms/rooms-list");
  } catch (error) {
    next(error);
  }
});

/*

//Create Review

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

//Edit Movie

router.get('/:id/edit-url', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById (id);
    res.render ('movie/update-view', movie);
  } catch(error){
    next(error);
  }
});

router.post('/:id/edit-url', async (req, res, next) => {
  try {
		const { id } = req.params;
		const { title, genre, plot, rating } = req.body;
		await Movie.findByIdAndUpdate(id, { title, genre, plot, rating }, { new: true });
		res.redirect("/movie/list-url");
	} catch(error){
		next(error);
	}
});

//Delete Room

router.post('/:id/delete-url', async (req, res, next) => {
  try {
		const { id } = req.params;
		await Movie.findByIdAndDelete(id);
    res.redirect("/room/room-list");
	} catch (error) {
		next(error);
	}
});

//See Full details

router.get('/:id/details-url', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id).populate('cast').populate('reviews');
    res.render ('movie/details-view', movie);
  } catch(error){
    next(error);
  }
});

//Search for a movie

router.get('/movie-search', async (req, res, next) => {
  try {
    const movies = await Movie.find({title : req.query.movie});
    const searchedMovie = req.query.movie;
    if (movies.length >= 1){
      res.render('movie/list-view', {movies});
    } else {
      res.render('movie/not-found-view', {searchedMovie});
    }
  } catch (err) {
    next(err);
  }
});
*/

module.exports = router;
const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isOwner = require("../middleware/isOwner.js");
const User = require ("../models/User.model.js");
const Review = require("../models/Review.model.js");
const Room = require("../models/Room.model.js");


//See full list of rooms, accessible to EVERYONE
router.get('/rooms-list', async (req, res, next) => {
  
  try {
    const rooms = await Room.find();
    res.render('rooms/rooms-list', {rooms});
  } catch (err) {
    next(err);
  }
});

//See create room form, only accessible to users logged in.
router.get('/rooms-create', isLoggedIn, (req, res, next) => {
  res.render('rooms/rooms-create');
});

//no need for middleware as only logged in users will have access to the view with the submit button
router.post('/create', async (req, res, next) => {
  try {
    const { name, description, imageUrl} = req.body;
    const userID = req.session.user._id;
    await Room.create({
      name, 
      description,
      imageUrl,
      owner : userID
    });
    res.redirect("/rooms/rooms-list");
  } catch (error) {
    next(error);
  }
});

//See Full details, only accessible to users logged in. Onwer has own route inside Middleware (isOwner)
router.get('/:id/rooms-details', [isLoggedIn, isOwner], async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id)
      .populate("owner reviews")
      .populate({
        path: "reviews",
        populate:{
          path: "user"
        }
      });
    res.render ('rooms/rooms-details', room);
  } catch(error){
    next(error);
  }
});

/*

//See Edit room form, no need for middleware as only owners will have access to the view with the edit button
router.get('/:id/edit-url', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById (id);
    res.render ('movie/update-view', movie);
  } catch(error){
    next(error);
  }
});

//no need for middleware as only owner will be able to access the view with the submit button
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

*/

router.post('/:id/delete-url', async (req, res, next) => {
  try {
		const { id } = req.params;
		await Movie.findByIdAndDelete(id);
    res.redirect("/room/room-list");
	} catch (error) {
		next(error);
	}
});

module.exports = router;
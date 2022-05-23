const router = require("express").Router();
const mongoose = require("mongoose");

const isLoggedIn = require("../middleware/isLoggedIn.js");
const isNotOwner = require("../middleware/isNotOwner.js");
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

//Create room, only accessible to users logged in.
router.get('/rooms-create', isLoggedIn, (req, res, next) => {
  res.render('rooms/rooms-create');
});

//Actually creates room, only accessible to users logged in.
router.post('/create', isLoggedIn, async (req, res, next) => {
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

//See Full details, only accessible to users logged in.
router.get('/:id/rooms-details', isLoggedIn, async (req, res, next) => {
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
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const roomOnwerId =  room.owner._id.toString();
    if (userId === roomOnwerId){
      const isOwner = true;
      res.render ('rooms/rooms-details', {
        room,
        user,
        isOwner
      });
    } else {
      const isUser = true;
      res.render ('rooms/rooms-details', {
        room,
        isUser
      });
    }
    
  } catch(error){
    next(error);
  }
});

//Edit Room, only accessible to owner
router.get('/:id/rooms-edit', isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById (id);
    res.render ('rooms/rooms-edit', room);
  } catch(error){
    next(error);
  }
});

//Actually edits room, only accessible to owner
router.post('/:id/rooms-edit', isOwner, async (req, res, next) => {
  try {
		const { id } = req.params;
		const { name, description, imageUrl } = req.body;
		await Room.findByIdAndUpdate(id, { name, description, imageUrl }, { new: true });
		res.redirect("/rooms/rooms-list");
	} catch(error){
		next(error);
	}
});

//Delete Room, only accessible to owner
router.post('/:id/rooms-delete', isOwner, async (req, res, next) => {
  try {
		const { id } = req.params;
		await Room.findByIdAndDelete(id);
    res.redirect("/rooms/rooms-list");
	} catch (error) {
		next(error);
	}
});

//Create review, only accessible to users who are not the owner
router.get('/:id/reviews-create', isNotOwner, async(req, res, next) => {
  const {id} = req.params;
  const room = await Room.findById(id);
  res.render('reviews/reviews-create', room);
});

//Actually creates the review, only accessible to users who are not the owner
router.post('/:id/reviews-create', isNotOwner, async (req, res, next) => {
  try{
      const { comment } = req.body;
      const { id } = req.params;
      const userID = req.session.user._id;
      const newReview = await Review.create ({
         user: userID,
         comment
      });
      const newReviewId = newReview._id;
      await Room.findByIdAndUpdate(id, { $addToSet: { reviews: newReviewId } });
      res.redirect(`/rooms/${id}/rooms-details`); 
  } catch (error) {
      next (error);
  }
});

module.exports = router;


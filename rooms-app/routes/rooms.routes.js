const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn.js");
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

//See Full details
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

//See Edit room form, no need for middleware as only owners will have access to the view with the edit button
router.get('/:id/rooms-edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById (id);
    res.render ('rooms/rooms-edit', room);
  } catch(error){
    next(error);
  }
});

//no need for middleware as only owner will be able to access the view with the edit button
router.post('/:id/rooms-edit', async (req, res, next) => {
  try {
		const { id } = req.params;
		const { name, description, imageUrl } = req.body;
		await Room.findByIdAndUpdate(id, { name, description, imageUrl }, { new: true });
		res.redirect("/rooms/rooms-list");
	} catch(error){
		next(error);
	}
});

//no need for middleware as only owner will be able to access the view with the delete button
router.post('/:id/rooms-delete', async (req, res, next) => {
  try {
		const { id } = req.params;
		await Room.findByIdAndDelete(id);
    res.redirect("/rooms/rooms-list");
	} catch (error) {
		next(error);
	}
});

//Create Review
//no need for middleware as only logged in users who are not owners will have access to the view with the review button
router.get('/:id/reviews-create', async(req, res, next) => {
  const {id} = req.params;
  const room = await Room.findById(id);
  res.render('reviews/reviews-create', room);
});

//no need for middleware as only logged in users who are not owners will have access to the view with the review button
router.post('/:id/reviews-create', async (req, res, next) => {
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


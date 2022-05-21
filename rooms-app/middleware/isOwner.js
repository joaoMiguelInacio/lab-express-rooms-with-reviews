const mongoose = require("mongoose");
const Room = require("../models/Room.model.js");

module.exports = async (req, res, next) => {
    // checks if the user is the owner when trying to access a specific page
    const { id } = req.params;
    const room = await Room.findById(id);
    const userID = req.session.user._id;
    const roomOnwerID = room.owner.toString();
    if (userID == roomOnwerID) {
        res.render('rooms/rooms-details-owner', room);
    }
    next();
  };
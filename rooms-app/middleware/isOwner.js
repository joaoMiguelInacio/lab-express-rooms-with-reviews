const mongoose = require("mongoose");
const Room = require("../models/Room.model.js");


module.exports = async (req, res, next) => {
    // checks if the user is the owner when trying to access a specific page
    const { id } = req.params;
    const room = await Room.findById(id);
    const whatever = req.session.user._id;
    const whatever2 = room.owner.toString();
    console.log(whatever);
    console.log(whatever2);
    if (whatever == whatever2) {
       console.log('whatever')
        res.render('rooms/rooms-details-owner', room);
    }
    next();
  };
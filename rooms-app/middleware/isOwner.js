module.exports = async (req, res, next) => {
    // checks if the user is the owner when trying to access a specific page
    const { id } = req.params;
    const room = await Room.findById(id);
    const whatever = `new ObjectId("${req.session.user._id}")`;
    const whatever2 = room.owner;
    if (whatever === whatever2) {
        res.render('rooms/rooms-details-owner', room);
    }
    next();
  };
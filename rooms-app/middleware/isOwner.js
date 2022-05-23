const Room = require("../models/Room.model.js");

module.exports = async (req, res, next) => {
    const userId = req.session.user._id;
    const { id } = req.params;
    const room = await Room.findById(id).populate("owner");
    const roomOnwerId =  room.owner._id.toString();
    if (userId !== roomOnwerId) {
      return res.redirect("/auth/login");
    }
    next();
  };
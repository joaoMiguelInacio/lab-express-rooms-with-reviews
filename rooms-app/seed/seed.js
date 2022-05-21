require('../db');
const mongoose = require('mongoose');
const Room = require ("../models/Room.model.js");
const rooms = require ("../data/room-data");


const roomsSeed = async () => {
    try{
      await Room.create(rooms);
      console.log(`${rooms.length} rooms created`);
      await mongoose.connection.close();
      console.log(`Disconnected from Mongo`);
    } catch (error) {
      console.error(error);
    }
  };
  roomsSeed();
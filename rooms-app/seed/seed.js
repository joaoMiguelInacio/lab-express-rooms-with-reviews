require('../db');
const mongoose = require('mongoose');
const Room = require ("../models/Room.model.js");
const rooms = require ("../data/room-data");
const Review = require ("../models/Review.model.js");
const reviews = require ("../data/review-data");

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

  const reviewsSeed = async () => {
    try{
      await Review.create(reviews);
      console.log(`${reviews.length} reviews created`);
      await mongoose.connection.close();
      console.log(`Disconnected from Mongo`);
    } catch (error) {
      console.error(error);
    }
  };
  reviewsSeed();
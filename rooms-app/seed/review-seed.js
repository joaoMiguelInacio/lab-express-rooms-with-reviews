require('../db');
const mongoose = require('mongoose');
const Review = require ("../models/Review.model.js");
const reviews = require ("../data/review-data");

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
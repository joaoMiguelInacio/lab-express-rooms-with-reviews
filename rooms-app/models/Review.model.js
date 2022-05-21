const { Schema, model } = require ('mongoose');
const reviewSchema = new Schema ({
    content: {
        type: String,
        maxlength: 250,
        required: true
    },
    room: {
        type: Schema.Types.ObjectId, ref: 'Rooms'
    }
});
const Review = model('Reviews', reviewSchema);
module.exports = Review;
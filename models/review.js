const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose
            .Schema.Types.ObjectId,
        ref: 'Movie', required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 0, max: 10
    },  // Rating between 0 and 10
    text: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true }); // adds createdAt and updatedAt automatically


reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    }
});// __v to manage versioning, especially for things like concurrent updates.
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Review = require("../models/review.js");

//Gnale- This is get all of the reviews made by the user
//GET / reviews/my-reviews
router.get("/my-reviews", verifyToken, async (req, res) => {
  try {
    const userReviews = await Review.find({ userId: req.user._id });
    res.status(200).json(userReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a review for a movie (user can only review once)
router.post('/:movieId', verifyToken, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const movieId = req.params.movieId;

    if (!text || rating == null) {
      return res.status(400).json({ error: 'Review text and rating are required' });
    }

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 0 and 10' });
    }

    const existingReview = await Review.findOne({ userId: req.user._id, movieId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this movie.' });
    }

    const newReview = new Review({ movieId, userId: req.user._id, text, rating });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating review' });
  }
});

// update a user's review for a specific movie
router.put('/:movieId', verifyToken, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const movieId = req.params.movieId;

    const review = await Review.findOne({ movieId, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you do not have permission to update it' });
    }

    review.text = text ?? review.text;
    review.rating = rating ?? review.rating;

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete a user's review for a specific movie
router.delete('/:movieId', verifyToken, async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const review = await Review.findOneAndDelete({ movieId, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Get the current user's review for a movie (used in MovieDetail)
router.get('/:movieId', verifyToken, async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const review = await Review.findOne({ movieId, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get review' });
  }
});

module.exports = router;
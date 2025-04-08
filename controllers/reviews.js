const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Review = require("../models/review.js");

// michelle??
// GET /users/:userId/reviews/new
// This route will display an Edit Form where the user can Review comment about the Movie
router.get('/reviews/new', verifyToken ,async (req, res) => {
  try {
    const currentReview = await Review.create(req.body);
    res.status(201).json(currentReview);
    res.send("Create new Review Comment");
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    // res.redirect('/'); //uncomment once the frontend is up
  }
});

// POST /reviews/:movieId
// This route allows a user to create a review for a specific movie
router.post('/:movieId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Review text is required' });
    }

    // Create a new review for the movie
    const newReview = new Review({
      movieId: req.params.movieId,
      userId: req.user._id,  // The current user making the review
      text
    });

    await newReview.save();
    res.status(201).json(newReview); // Return the newly created review
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating review' });
  }
});


//EDIT
// PUT /users/:userId/reviews/:reviewId
// PUT /reviews/:reviewId MICHELLE
// This route will allow the user to edit their reviews
router.put('/:reviewId', verifyToken ,async (req, res) => {
  try {
    const currentReview = await Review.findById(req.params.reviewId);
    if (!currentReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const review = await currentReview.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true }
    );

    // ensures the current user is the author of the comment
    if (review.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this comment' });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    // res.redirect('/'); //uncomment once the frontend is up
  }
});

// DELETE /reviews/:reviewId MICHELLE
// DELETE /users/:userId/reviews/:reviewId
// THis route will  allow the user to delete their reviews
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const currentReview = await Review.findById(req.params.reviewId);
    if (!currentReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const review = currentReview.text.id(req.params.reviewId); //the Id comes from monggose

    // ensures the current user is the author of the comment
    if (review.userId.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this comment' });
    }

    review.text.remove({ _id: req.params.reviewId });
    await review.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
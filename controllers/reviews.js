const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
// const User = require("../models/user.js");
const Movie = require("../models/movie.js"); //TMDb API
const Review = require("../models/review.js");

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



//EDIT
// PUT /users/:userId/reviews/:reviewId
// This route will allow the user to edit their reviews
router.put('/reviews/:reviewId', verifyToken ,async (req, res) => {
  try {
    const currentReview = await Review.findById(req.params.reviewId);
    const updateReview = await currentReview.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true }
    );

    res.status(201).json(updateReview);
    res.send("Create new Review Comment");
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    // res.redirect('/'); //uncomment once the frontend is up
  }
});

// DELETE /users/:userId/reviews/:reviewId
// THis route will  allow the user to delete their reviews
router.delete('/review/:reviewId', verifyToken, async (req, res) => {
  try {
    const currentReview = await Review.findById(req.params.hootId);
    const review = currentReview.text.id(req.params.reviewId);

    // ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this comment' });
    }

    review.text.remove({ _id: req.params.reviewId });
    await hoot.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router

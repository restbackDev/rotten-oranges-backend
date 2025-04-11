const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Review = require("../models/review.js");

//GET / reviews/my-reviews
router.get("/my-reviews", verifyToken, async (req, res) => {
  try {
    const userReviews = await Review.find({ userId: req.user._id });
    res.status(200).json(userReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:userId/reviews/new
// This route will display an Edit Form where the user can Review comment about the Movie
router.get("/movies/:movieId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT /reviews/:reviewId - Edit a review
router.put("/:reviewId", verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    review.content = req.body.content;
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /reviews/:reviewId - Delete a review
router.delete("/:reviewId", verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

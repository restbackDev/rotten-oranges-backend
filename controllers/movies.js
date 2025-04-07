const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
// const User = require("../models/user.js");
const Movie = require("../models/movie.js"); //TMDb API
const Review = require("../models/review.js")

// GET /users/:userId/movies/:movieId
// This route will direct the user into a specific Movie with infos included
router.get("/movies/:movieId", verifyToken, async (req, res) => {
    try {
      const currentMovie = await Movie.findById(req.params.tmdbId)
      res.status(200).json(currentMovie);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });

//POST /users/:userId/movies/:movieId
// This route will post any updated changes in the movie page
router.post ("/movies/:movieId", verifyToken, async (req,res) => {
  try {
    const currentReview = await Review.findById(req.params.tmdbId)
    currentReview.text.push(req.body) // pushed the new/updated review comment
    await currentReview.save(); //saves the new/updated review comment
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

module.exports = router


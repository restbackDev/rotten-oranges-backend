const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
// const User = require("../models/user.js");
const Movie = require("../models/movie.js"); //TMDb API
// const Review = require("../models/review.js")

//GET /users/:userId/movies/:movieId
// THis route will direct the user into a specific Movie with info included
router.get("/movies/:movieId", verifyToken, async (req, res) => {
    try {
      const currentMovie = await Movie.findById(req.params.tmdbId)
        .populate("title", "overview", "posterPath", "releaseDate", "genreIds", "genreNames");
      //req movie id's title, image, summary, rating, etc...

      res.status(200).json(currentMovie);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router
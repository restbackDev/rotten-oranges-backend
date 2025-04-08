const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Movie = require("../models/movie.js");
const Review = require("../models/review.js");
const { fetchAndSavePopularMovies } = require("../services/movieService");

const dotenv = require("dotenv");

dotenv.config();
// console.log('TMDB API KEY:', process.env.TMDB_API_KEY); // DELETE LATER

// Fetch movie details from TMDb API and save it to DB
// Fetch popular movies from TMDb and save to DB (controller)
router.get("/discover", verifyToken, async (req, res) => {
  try {
    // Fetch and save the popular movies
    await fetchAndSavePopularMovies();

    // Return the list of movies from the database
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error in fetching or saving movies:", error);
    res.status(500).json({ error: "Error fetching movies from TMDb" });
  }
});

// GET /users/:userId/movies/:movieId
// This route will direct the user into a specific Movie with infos included
router.get("/:movieId", verifyToken, async (req, res) => {
    try {
      const currentMovie = await Movie.findById(req.params.movieId);
      if (!currentMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.status(200).json(currentMovie);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });

//POST /users/:userId/movies/:movieId
// This route will post any updated changes in the movie page
router.post ("/:movieId", verifyToken, async (req,res) => {
  try {
    const currentReview = await Review.findById(req.params.movieId)
    currentReview.text.push(req.body) // pushed the new/updated review comment
    await currentReview.save(); //saves the new/updated review comment
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

module.exports = router


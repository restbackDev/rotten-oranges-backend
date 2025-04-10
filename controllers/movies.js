const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Movie = require("../models/movie.js");
const Review = require("../models/review.js");
const { fetchAndSavePopularMovies } = require("../services/movieService");

const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
// console.log('TMDB API KEY:', process.env.TMDB_API_KEY); // DELETE LATER

// Fetch movie details from TMDb API and save it to DB
// Fetch popular movies from TMDb and save to DB (controller)
router.get("/discover", verifyToken, async (req, res) => {
  try {
    // Fetch and save the popular movies
    await fetchAndSavePopularMovies();

    // Returns the list of movies from the database
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error in fetching or saving movies:", error);
    res.status(500).json({ error: "Error fetching movies from TMDb" });
  }
});

// POST /movies/:movieId/reviews - Creates a review for a movie
router.post("/:movieId/reviews", verifyToken, async (req, res) => {
  try {
    const review = new Review({
      movieId: req.params.movieId,
      userId: req.user._id, // 
      text: req.body.text,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:movieId/reviews", verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: error.message });
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

router.get("/:movieId/watch-providers", verifyToken, async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching watch providers:", error.message);
    res.status(500).json({ error: "Failed to fetch watch providers" });
  }
});

module.exports = router


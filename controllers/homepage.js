const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const User = require("../models/user.js");
const Movie = require("../models/movie.js"); //TMDb API
const Review = require("../models/review.js")


// GET /users/:userId/homepage
router.get('/homepage', verifyToken, async (req,res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const showMovies = await Movie.find(req.movie._id);

    res.send("Hello user this is the homepage")

  //   TODO: res.render('URL route'), {
  //   user: currentUser //displays the username
  //   movie: req.body.movieId //displays list of movies
  // }

    res.status(201).json(showMovies)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})


// GET /users/:userId/homepage/:movieId
// This route will display a specific Movie with it's information
router.get("/homepage/:movieId", verifyToken, async (req, res) => {
  try {
    const currentMovie = await Movie.findById(req.params.tmdbId);
    //req movie title, image, summary, rating, etc... 
    res.status(200).json(currentMovie);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});


// GET /users/:userId/homepage/:movieId/new
// This route will link the user to "Create a Review Comment Page"
router.get('/homepage/:movieId/new', verifyToken ,async (req, res) => {
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


// POST /users/:userId/homepage/:movieId/
// This route will display the user's newly reviewed comment
router.post('/homepage/:movieId', verifyToken ,async (req, res) => {
  try {
    const currentMovie = await Movie.findById(req.params.movieId)
    const currentReview = await Review.findById(req.params.reviewId)
    currentReview.text.push(req.body)
    await currentReview.save()
    res.send("POST: Current movie Page");
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:userId/homepage/:movieId/[:reviewId or /edit]
// This route will let the user edit their review comment
router.post('/homepage/:movieId/edit', verifyToken ,async (req, res) => {
  try {
    // Update movie review:
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true }
    );


    res.send("Edit Review Route");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /users/:userId/homepage/:movieId/:reviewId
// This route will let the user delete their review comment
router.delete('/homepage/:movieId/:reviewId', verifyToken, async (req,res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json(deletedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;


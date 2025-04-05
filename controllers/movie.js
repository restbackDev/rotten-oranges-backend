const express = require('express');
const router = express.Router();
const User = require('../models/user');
//const 


// GET /users/:userId/movies/:moviesId "get all users"
// TODO: add "verify token" once the models are all complete
// TODO: query the movieID once the models are all complete
router.get('/homepage/:movieId', async (req, res) => {
    try {
        // const currentMovie = await Movie.findById(:movieId);
        // const res.json(currentMovie)
        // request for all the reviews in this movie
        
        res.send("This this the current movie page ")
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
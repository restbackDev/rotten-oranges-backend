// const express = require('express');
// const router = express.Router();
// const Favorite = require('../models/favorite');
// const verifyToken = require('../middleware/verify-token');

// // Get all favorites for a user
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const favorites = await Favorite.find({ userId: req.user._id }).populate('movieId');
//     res.json(favorites);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Add a new favorite
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const favorite = await Favorite.create({
//       userId: req.user._id,
//       movieId: req.body.movieId,
//     });
//     res.status(201).json(favorite);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a favorite
// router.delete('/:id', verifyToken, async (req, res) => {
//   try {
//     await Favorite.findByIdAndDelete(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Favorite = require('../models/favorite');
const Movie = require('../models/movie');

// POST /favorites/:movieId - Add to favorites
router.post('/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ user: userId, movie: movieId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }

    const newFavorite = new Favorite({ user: userId, movie: movieId });
    await newFavorite.save();

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// GET /favorites - Get all favorites for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ user: userId }).populate('movie');
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// DELETE /favorites/:movieId - Remove a movie from favorites
router.delete('/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;

    const deleted = await Favorite.findOneAndDelete({ user: userId, movie: movieId });

    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// GET /favorites/count/:movieId - Get total number of favorites for a movie
router.get('/count/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const count = await Favorite.countDocuments({ movieId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count favorites' });
  }
});

module.exports = router;
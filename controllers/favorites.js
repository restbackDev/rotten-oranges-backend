const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const verifyToken = require('../middleware/verify-token');

// Get all favorites for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate('movieId');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new favorite
router.post('/', verifyToken, async (req, res) => {
  try {
    const favorite = await Favorite.create({
      userId: req.user._id,
      movieId: req.body.movieId,
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a favorite
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
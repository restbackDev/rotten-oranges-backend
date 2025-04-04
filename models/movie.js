const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  overview: String,
  posterPath: String,
  releaseDate: String,
  genreIds: [Number], // Store genre_ids from TMDb API, TOD: maybe take away
  genreNames: [String] // Converted names from genreIds
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);
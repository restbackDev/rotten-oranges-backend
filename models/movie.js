const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: String,
  overview: String,
  posterPath: String,
  releaseDate: String,
  voteAverage: Number, // Added this new field Gnale
  runtime: Number, // Added this new field Gnale
  genreIds: [Number], 
  genreNames: [String], 
  backdropPath: String, 
  cast: [
    {
      _id: Number,
      name: String,
      character: String,
      profilePath: String,
    },
  ], 
},
{
  timestamps: true,
});



module.exports = mongoose.model('Movie', movieSchema);
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
  backdropPath: String, // Added this new field Gnale
  cast: [
    {
      _id: Number,
      name: String,
      character: String,
      profilePath: String,
    },
  ], // Added this new field as an array of cast members Gnale
},
{
  timestamps: true,
});


module.exports = mongoose.model('Movie', movieSchema);
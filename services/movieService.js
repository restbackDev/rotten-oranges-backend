const fetch = require("node-fetch");
const Movie = require("../models/movie");
const dotenv = require("dotenv");

dotenv.config();

async function fetchAndSavePopularMovies() {
  try {
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        },
      }
    );

    const data = await tmdbResponse.json();

    if (!tmdbResponse.ok) {
      throw new Error(data.status_message || "Failed to fetch movies from TMDb");
    }

    for (const movieData of data.results) {
      // Fetch full movie details
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieData.id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          },
        }
      );
      const details = await detailsRes.json();

      // Fetch cast data
      const castRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieData.id}/credits`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          },
        }
      );
      const castData = await castRes.json();

      // Upsert movie into MongoDB
      await Movie.findOneAndUpdate(
        { tmdbId: movieData.id },
        {
          $set: {
            title: movieData.title,
            overview: movieData.overview,
            posterPath: movieData.poster_path,
            backdropPath: movieData.backdrop_path,
            releaseDate: movieData.release_date,
            voteAverage: details.vote_average || null,
            runtime: details.runtime || null,
            genreIds: movieData.genre_ids,
            genreNames: details.genres
              ? details.genres.map((genre) => genre.name)
              : [],
            cast: castData.cast
              ? castData.cast.map((actor) => ({
                  _id: actor.id,
                  name: actor.name,
                  character: actor.character,
                  profilePath: actor.profile_path,
                }))
              : [],
          },
        },
        { upsert: true, new: true }
      );

    //   console.log(`Updated movie: ${movieData.title}`);
    }
  } catch (error) {
    console.error("Error fetching or saving movies:", error);
  }
}

module.exports = {
  fetchAndSavePopularMovies,
};
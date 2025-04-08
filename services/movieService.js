const Movie = require("../models/movie");
const dotenv = require("dotenv");

dotenv.config();

// Fetch popular movies from TMDb API
async function fetchAndSavePopularMovies() {
    try {
        const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`, // API token from .env file
                },
            }
        );

        const data = await tmdbResponse.json();

        if (!tmdbResponse.ok) {
            throw new Error(data.status_message || "Failed to fetch movies from TMDb");
        }

        // Save each movie to the database
        for (const movieData of data.results) {
            let movie = await Movie.findOne({ tmdbId: movieData.id });
            if (!movie) {
                movie = new Movie({
                    tmdbId: movieData.id,
                    title: movieData.title,
                    overview: movieData.overview,
                    posterPath: movieData.poster_path,
                    releaseDate: movieData.release_date,
                    genreIds: movieData.genre_ids,
                    genreNames: movieData.genres ? movieData.genres.map((genre) => genre.name) : [],
                });
                await movie.save();
            }
        }
    } catch (error) {
        console.error("Error fetching or saving movies:", error);
    }
}

module.exports = {
    fetchAndSavePopularMovies,
};
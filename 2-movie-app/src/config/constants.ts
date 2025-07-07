const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const DEFAULT_POSTER_PATH = "./placeholder-movie-poster.png";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export { IMAGE_BASE_URL, DEFAULT_POSTER_PATH, API_BASE_URL, API_OPTIONS };

import { useCallback, useEffect, useState } from "react";
import type Movie from "../types/movie";
import type MovieResponse from "../types/movieResponse";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS: RequestInit = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const useMovies = (searchTerm: string) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use useCallback to memoize fetchMovies function. This prevent unnecessary re-creations of the function on every render. Then the function is recreated only if searchTerm changes
  const fetchMovies = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage("");
    setAllMovies([]);

    try {
      const endpoint: string = searchTerm
        ? `/search/movie?query=${encodeURIComponent(searchTerm)}&`
        : "/discover/movie?";
      const response: Response = await fetch(
        `${API_BASE_URL}${endpoint}sort_by=popularity.desc`,
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error(`HTTP Status Error: ${response.status}`);
      }

      const data: MovieResponse = await response.json();
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Incorrect data");
      }
      setAllMovies(data.results);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          `An unknown error occured when fetching movies: ${error}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Use of the debouncing technique to avoid calling API on every single keystroke
    const controller = new AbortController();
    const debounceTimeout = setTimeout(() => {
      fetchMovies();
    }, 500); // The API will be called only if the user stopped typing for 500ms

    return () => {
      clearTimeout(debounceTimeout); // Cancels the scheduled API call if the user types again before the debounce delay finishes. This prevents unnecessary API requests for outdated search terms.
      controller.abort(); // Abort any ongoing fetch request if the component unmounts or if a new search term is entered before the previous fetch comples. This helps avoid race conditions and memory leaks.
    };
  }, [searchTerm]);

  return { allMovies, errorMessage, isLoading };
};

export default useMovies;

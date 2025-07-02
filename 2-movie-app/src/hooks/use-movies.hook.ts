import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import type { MetricDocument, Movie, MovieResponse } from "../types";
import { getMetrics, updateSearchCount } from "../services";
import { API_BASE_URL, API_OPTIONS } from "../config/constants.ts";

/**
 * Custom hook for fetching and managing movie data and metrics.
 * @param searchTerm - The search term to filter movies.
 * @returns An object containing movies, metrics, loading state, and error messages.
 */
const useMoviesHook = (searchTerm: string) => {
  // State variables for movies, metrics, loading, and error
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [metrics, setMetrics] = useState<MetricDocument[]>([]);

  // Debounce the search term to reduce API calls
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm],
  );

  /**
   * Fetches movie metrics from the server.
   * Only updates state if component is still mounted.
   */
  const fetchMetrics = useCallback(async (): Promise<void> => {
    setIsLoadingMetrics(true);
    setErrorMessage("");

    try {
      const response = await getMetrics();
      if (response && response.total > 0) {
        setMetrics(response.documents);
      }
    } catch (error) {
      setErrorMessage(
        "Failed to load trending movies. Please try again later.",
      );
      console.error(`Error fetching metrics: ${error}`);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  /**
   * Fetches movies based on the search query.
   * Handles loading, error, and updates metrics on successful search.
   * Uses AbortController for request cancellation.
   */
  const fetchMovies = useCallback(
    async (query: string, signal?: AbortSignal): Promise<void> => {
      setIsLoading(true);
      setErrorMessage("");

      // Clear movies only if performing a search
      if (query) setAllMovies([]);

      try {
        const endpoint = query
          ? `/search/movie?query=${encodeURIComponent(query)}&`
          : "/discover/movie?";

        const response = await fetch(
          `${API_BASE_URL}${endpoint}sort_by=popularity.desc`,
          { ...API_OPTIONS, signal },
        );

        if (!response.ok) {
          setErrorMessage(`HTTP error! status: ${response.status}`);
          return;
        }

        const data: MovieResponse = await response.json();
        if (!data?.results) {
          setErrorMessage("Invalid data received from server");
          return;
        }

        setAllMovies(data.results);

        // If searching and results found, update metrics
        if (query && data.results.length > 0) {
          try {
            await updateSearchCount(query, data.results[0]);
            await fetchMetrics();
          } catch (error) {
            // Metrics update failure is non-blocking for user
            console.error("Failed to update search count:", error);
          }
        }
      } catch (error: unknown) {
        // Ignore abort errors (expected on unmount or new search)
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        if (error instanceof Error) {
          setErrorMessage(
            error.message.includes("Failed to fetch")
              ? "Unable to connect to the server. Please check your internet connection."
              : `Error: ${error.message}`,
          );
        } else {
          setErrorMessage(
            "An unexpected error occurred while fetching movies.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMetrics],
  );

  // Fetch metrics on component mount
  useEffect(() => {
    void fetchMetrics();
  }, [fetchMetrics]);

  // Fetch movies when debounced search term changes, with cancellation support
  useEffect(() => {
    const controller = new AbortController();
    void fetchMovies(debouncedSearchTerm, controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchMovies, debouncedSearchTerm]);

  return {
    metrics,
    allMovies,
    errorMessage,
    isLoading,
    isLoadingMetrics,
  };
};

export default useMoviesHook;

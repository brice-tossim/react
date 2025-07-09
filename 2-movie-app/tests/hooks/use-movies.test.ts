import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import * as services from "../../src/services";
import useMovies from "../../src/hooks/use-movies";

// Mock fetch globally
const globalAny = global as unknown as { fetch: typeof fetch };
const mockFetch = vi.fn();
globalAny.fetch = mockFetch;

// Mock timers
vi.useFakeTimers({
  shouldAdvanceTime: true,
});

// Mock the metrics service
vi.mock("../../src/services/metrics.service", () => ({
  getMetrics: vi.fn(),
  updateSearchCount: vi.fn().mockResolvedValue(undefined),
}));

// Mock the search service
vi.mock("../../src/services/search.service", () => ({
  searchMovies: vi.fn(),
}));

describe("useMovies hook", () => {
  const mockMetricsResponse = {
    total: 2,
    documents: [
      {
        $id: "1",
        $collectionId: "metrics",
        $databaseId: "main",
        $createdAt: "2023-01-01T00:00:00.000Z",
        $updatedAt: "2023-01-01T00:00:00.000Z",
        $permissions: [],
        search_term: "test",
        movie_id: 1,
        movie_title: "Test Movie 1",
        search_count: 10,
        poster_path: "/poster1.jpg",
      },
      {
        $id: "2",
        $collectionId: "metrics",
        $databaseId: "main",
        $createdAt: "2023-01-01T00:00:00.000Z",
        $updatedAt: "2023-01-01T00:00:00.000Z",
        $permissions: [],
        search_term: "test2",
        movie_id: 2,
        movie_title: "Test Movie 2",
        search_count: 5,
        poster_path: "/poster2.jpg",
      },
    ],
  };

  const mockMoviesResponse = {
    results: [
      { id: 1, title: "Movie 1" },
      { id: 2, title: "Movie 2" },
    ],
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up default mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue({
      total: 0,
      documents: [],
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
  });

  afterEach(() => {
    // Reset timers after each test
    vi.clearAllTimers();
  });

  it("should initialize with loading states", async () => {
    const { result } = renderHook(() => useMovies(""));

    // Initial state
    expect(result.current.metrics).toEqual([]);
    expect(result.current.allMovies).toEqual([]);
    expect(result.current.errorMessage).toBe("");
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoadingMetrics).toBe(true);

    // Wait for initial fetches to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isLoadingMetrics).toBe(false);
    });
  });

  it("should fetch metrics on mount and update metrics state", async () => {
    // Override the default mock for this test
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    const { result } = renderHook(() => useMovies(""));

    // Initial loading state
    expect(result.current.isLoadingMetrics).toBe(true);

    // Wait for metrics to be loaded
    await waitFor(() => {
      expect(services.getMetrics).toHaveBeenCalled();
      expect(result.current.metrics).toEqual(mockMetricsResponse.documents);
      expect(result.current.isLoadingMetrics).toBe(false);
    });
  });

  it("should handle fetch error correctly", async () => {
    // Set up the initial metrics fetch to resolve successfully
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    // Set up the movies fetch to reject with a network error
    const error = new Error("Failed to fetch");
    mockFetch.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMovies("test"));

    // Wait for the initial metrics fetch to complete
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for the debounced to complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Wait for the error to be set
    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "Unable to connect to the server. Please check your internet connection.",
      );
    });

    // Verify the loading state is false after the error
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle metrics fetch error on initial load", async () => {
    // Mock services.getMetrics to reject with a specific error
    const error = new Error("Metrics error");
    vi.spyOn(services, "getMetrics").mockRejectedValueOnce(error);

    // Mock console.error to prevent error logs in test output
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useMovies(""));

    // Wait for the metrics error
    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "Failed to load trending movies. Please try again later.",
      );
      expect(result.current.metrics).toEqual([]);
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Clean up
    consoleError.mockRestore();
  });

  it("should fetch movies with search term and update state", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // First call is for metrics, second for movies
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMoviesResponse),
      });

    const { result } = renderHook(() => useMovies("test"));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Verify movies are loaded
    await waitFor(() => {
      expect(result.current.allMovies).toEqual(mockMoviesResponse.results);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.errorMessage).toBe("");
    });
  });

  it("should handle empty search term by fetching popular movies", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // Mock successful popular movies response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMoviesResponse),
    });

    const { result } = renderHook(() => useMovies(""));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Verify popular movies are loaded
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/discover/movie"),
        expect.any(Object),
      );
      expect(result.current.allMovies).toEqual(mockMoviesResponse.results);
    });
  });

  it("should handle HTTP error responses", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // First call is for metrics, second for movies (which will fail)
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.resolve({ message: "Server error" }),
      });

    const { result } = renderHook(() => useMovies("test"));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Verify error handling
    await waitFor(() => {
      expect(result.current.errorMessage).toContain("HTTP error! status: 500");
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle abort errors silently", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // Create an abort error
    const abortError = new DOMException(
      "The user aborted a request.",
      "AbortError",
    );

    // First call is for metrics, second for movies (which will be aborted)
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
      .mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useMovies("test"));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Verify abort is handled silently
    await waitFor(() => {
      expect(result.current.errorMessage).toBe("");
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle invalid data response", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // Mock fetch to return invalid data (no results array)
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }), // Metrics response
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}), // Invalid movies response (no results)
      });

    const { result } = renderHook(() => useMovies("test"));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    // Verify error message for invalid data
    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "Invalid data received from server",
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should handle metrics update failure non-blocking", async () => {
    // Mock console.error to verify it's called
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue({
      total: 0,
      documents: [],
    });

    // Mock services.updateSearchCount to reject
    const updateSearchCountSpy = vi
      .spyOn(services, "updateSearchCount")
      .mockRejectedValueOnce(new Error("Failed to update metrics"));

    // Mock successful movies response with at least one result
    const mockSearchResponse = {
      results: [{ id: 1, title: "Test Movie" }],
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }), // Metrics response
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      });

    const { result } = renderHook(() => useMovies("test"));

    // Wait for metrics to load
    await waitFor(() => {
      expect(result.current.isLoadingMetrics).toBe(false);
    });

    // Wait for debounce and API call
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
      // Allow any pending promises to resolve
      await Promise.resolve();
    });

    // Verify movies are loaded
    await waitFor(() => {
      expect(result.current.allMovies).toEqual(mockSearchResponse.results);
      expect(result.current.isLoading).toBe(false);
    });

    // Verify metrics update was attempted with the first movie
    expect(updateSearchCountSpy).toHaveBeenCalledWith(
      "test",
      mockSearchResponse.results[0],
    );

    // Verify console.error was called with the expected error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to update search count:",
      expect.any(Error),
    );

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it("should handle different error types correctly", async () => {
    // Set up mocks
    vi.spyOn(services, "getMetrics").mockResolvedValue(mockMetricsResponse);

    // Test case 1: Network error
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
      .mockRejectedValueOnce(new Error("Failed to fetch"));

    const { result, rerender } = renderHook(
      ({ searchTerm }) => useMovies(searchTerm),
      {
        initialProps: { searchTerm: "network-error" },
      },
    );

    // Wait for debounce and error
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "Unable to connect to the server. Please check your internet connection.",
      );
    });

    // Test case 2: Generic error
    mockFetch.mockRejectedValueOnce(new Error("Some other error"));
    rerender({ searchTerm: "generic-error" });

    // Wait for debounce and error
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Error: Some other error");
    });

    // Test case 3: Non-Error object
    mockFetch.mockRejectedValueOnce("Just a string error");
    rerender({ searchTerm: "string-error" });

    // Wait for debounce and error
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "An unexpected error occurred while fetching movies.",
      );
    });
  });
});

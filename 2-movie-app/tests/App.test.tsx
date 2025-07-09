import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import useMovies from "../src/hooks/use-movies";
import type { MetricDocument, Movie } from "../src/types";

// Mock the useMovies hook
vi.mock("../src/hooks/use-movies");

const mockUseMovies = vi.mocked(useMovies);

describe("App Component", () => {
  // Mock data
  const mockMetrics: MetricDocument[] = [
    {
      $id: "1",
      $collectionId: "metrics",
      $databaseId: "main",
      $createdAt: "2023-01-01T00:00:00.000Z",
      $updatedAt: "2023-01-01T00:00:00.000Z",
      $permissions: [],
      search_term: "inception",
      movie_id: 1,
      search_count: 100,
      poster_path: "/inception.jpg",
      movie_title: "Inception",
    },
  ];

  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "Inception",
      backdrop_path: "/inception-bg.jpg",
      genre_ids: [28, 878],
      poster_path: "/inception.jpg",
      vote_average: 8.4,
      original_language: "en",
      release_date: "2010-07-16",
    },
    {
      id: 2,
      title: "Interstellar",
      backdrop_path: "/interstellar-bg.jpg",
      genre_ids: [12, 18, 878],
      poster_path: "/interstellar.jpg",
      vote_average: 8.6,
      original_language: "en",
      release_date: "2014-11-07",
    },
  ];

  const defaultReturn = {
    metrics: mockMetrics,
    allMovies: mockMovies,
    errorMessage: "",
    isLoading: false,
    isLoadingMetrics: false,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Set default mock implementation
    mockUseMovies.mockReturnValue(defaultReturn);
  });

  it("renders the header component", () => {
    render(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("displays trending movies section when metrics are available", () => {
    render(<App />);
    const trendingSection = document.querySelector(
      '[data-trending-movies="section"]',
    );
    expect(trendingSection).toBeInTheDocument();
    // Add type assertion and null check
    expect(trendingSection).not.toBeNull();
    // Find the image within the trending section
    const trendingImage = within(trendingSection as HTMLElement).getByAltText(
      "Inception",
    );
    expect(trendingImage).toBeInTheDocument();
  });

  it("shows loading spinner when loading movies", () => {
    mockUseMovies.mockReturnValue({
      ...defaultReturn,
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMsg = "Failed to fetch movies";
    mockUseMovies.mockReturnValue({
      ...defaultReturn,
      errorMessage: errorMsg,
    });

    render(<App />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it("displays movies when data is loaded", () => {
    render(<App />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  it("calls useMovies with initial empty search term", () => {
    render(<App />);
    expect(mockUseMovies).toHaveBeenCalledWith("");
  });

  it("handles empty movie list", () => {
    mockUseMovies.mockReturnValue({
      ...defaultReturn,
      allMovies: [],
    });

    render(<App />);
    // Verify no movies are rendered
    expect(screen.queryByText("Inception")).not.toBeInTheDocument();
  });
});

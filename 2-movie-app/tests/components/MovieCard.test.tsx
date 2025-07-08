import { render, screen } from "@testing-library/react";
import MovieCard from "../../src/components/MovieCard";
import { describe, expect, it } from "vitest";

describe("MovieCard Component", () => {
  const defaultProps = {
    movie: {
      id: 1,
      title: "Test Movie",
      vote_average: 7.5,
      poster_path: "/test-poster.jpg",
      original_language: "en",
      release_date: "2023-01-15",
      backdrop_path: "/backdrop.jpg",
      genre_ids: [1, 2, 3],
    },
  };

  it("renders movie details correctly", () => {
    render(<MovieCard movie={defaultProps.movie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("7.5")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();

    // Get all images and find the movie poster by its alt text
    const images = screen.getAllByRole("img");
    const posterImg = images.find(
      (img) => img.getAttribute("alt") === "Movie poster",
    );
    expect(posterImg).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test-poster.jpg",
    );
  });

  it("uses default poster when poster_path is not provided", () => {
    const movieWithoutPoster = {
      ...defaultProps.movie,
      poster_path: "",
    };

    render(<MovieCard movie={movieWithoutPoster} />);

    // Get all images and find the movie poster by its alt text
    const images = screen.getAllByRole("img");
    const posterImg = images.find(
      (img) => img.getAttribute("alt") === "Movie poster",
    );
    expect(posterImg).toHaveAttribute("src", "./placeholder-movie-poster.png");
  });

  it("shows N/A when original_language is not provided", () => {
    const movieWithoutLanguage = {
      ...defaultProps.movie,
      original_language: "",
    };

    render(<MovieCard movie={movieWithoutLanguage} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows N/A when release_date is not provided", () => {
    const movieWithoutDate = {
      ...defaultProps.movie,
      release_date: "",
    };

    render(<MovieCard movie={movieWithoutDate} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("shows N/A when vote_average is not provided", () => {
    const movieWithoutRating = {
      ...defaultProps.movie,
      vote_average: 0,
    };

    render(<MovieCard movie={movieWithoutRating} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});

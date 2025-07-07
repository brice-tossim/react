import MovieCard from "./MovieCard";
import type { Movie } from "../types";

interface AllMoviesProps {
  movies: Movie[];
}

const AllMovies = ({ movies }: AllMoviesProps) => {
  return (
    <section className="all-movies">
      <h2 className="mt-10">All Movies</h2>
      <ul>
        {movies && movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-white">No results ...</p>
        )}
      </ul>
    </section>
  );
};

export default AllMovies;

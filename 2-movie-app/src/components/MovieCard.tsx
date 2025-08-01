import type { Movie } from "../types";
import { DEFAULT_POSTER_PATH, IMAGE_BASE_URL } from "../config/constants";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({
  movie: { title, vote_average, poster_path, original_language, release_date },
}: MovieCardProps) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path ? `${IMAGE_BASE_URL}${poster_path}` : DEFAULT_POSTER_PATH
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">
            {original_language ? original_language : "N/A"}
          </p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

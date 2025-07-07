export interface Movie {
  id: number;
  backdrop_path: string;
  title: string;
  genre_ids: number[];
  poster_path: string;
  vote_average: number;
  original_language: string;
  release_date: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

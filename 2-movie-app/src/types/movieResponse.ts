import type Movie from "./movie";

export default interface MovieResponse {
    page: number;
    results: Movie[]
    total_pages: number;
    total_results: number;
}
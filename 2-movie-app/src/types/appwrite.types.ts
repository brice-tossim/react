import { type Models } from "appwrite";

export interface MetricDocument extends Models.Document {
  search_term: string;
  movie_id: number;
  movie_title: string;
  search_count: number;
  poster_path: string;
}

export type MetricListDocument = Models.DocumentList<MetricDocument> | null;

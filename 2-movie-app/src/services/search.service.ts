import { ID, Query } from "appwrite";
import {
  COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../config/appwrite.config";
import { IMAGE_BASE_URL } from "../config/constants";
import type { MetricDocument, Movie } from "../types";

export const updateSearchCount = async (
  searchTerm: string,
  movie: Movie,
): Promise<void> => {
  try {
    const existingDocs = await databases.listDocuments<MetricDocument>(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.or([
          Query.equal("movie_id", movie.id),
          Query.equal("search_term", searchTerm),
        ]),
      ],
    );

    if (existingDocs.total > 0) {
      const document = existingDocs.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
        search_count: document.search_count + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        search_term: searchTerm,
        movie_id: movie.id,
        movie_title: movie.title,
        search_count: 1,
        poster_path: `${IMAGE_BASE_URL}${movie.poster_path}`,
      });
    }
  } catch (error) {
    throw new Error(`Error updating search count: ${error}`);
  }
};

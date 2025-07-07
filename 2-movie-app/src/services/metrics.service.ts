import {
  COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../config/appwrite.config.ts";
import { Query } from "appwrite";
import type { MetricDocument, MetricListDocument } from "../types";

export const getMetrics = async (): Promise<MetricListDocument> => {
  try {
    return await databases.listDocuments<MetricDocument>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.orderDesc("search_count"), Query.limit(5)],
    );
  } catch (error) {
    throw new Error(`Error fetching metrics: ${error}`);
  }
};

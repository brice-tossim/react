import { describe, expect, it, Mock, vi } from "vitest";
import { Query } from "appwrite";
import { databases } from "../../src/config/appwrite.config";
import { getMetrics } from "../../src/services";

// Mock the appwrite.config module and its exports
vi.mock("../../src/config/appwrite.config", () => ({
  databases: {
    listDocuments: vi.fn(),
  },
  DATABASE_ID: "test_database",
  COLLECTION_ID: "test_collection",
}));

// Mock the Query object
vi.mock("appwrite", async () => {
  const actual = await vi.importActual<typeof import('appwrite')>('appwrite');
  return {
    ...actual,
    Query: {
      ...actual.Query,
      orderDesc: vi.fn().mockReturnValue("orderDesc"),
      limit: vi.fn().mockReturnValue("limit"),
    },
  };
});

describe("getMetrics", () => {
  it("calls databases.listDocuments with correct parameters", async () => {
    const mockResponse = {
      total: 1,
      documents: [{ $id: "1", search_count: 10 }],
    };
    (databases.listDocuments as Mock).mockResolvedValue(mockResponse);

    await getMetrics();

    expect(databases.listDocuments).toHaveBeenCalledWith(
      "test_database",
      "test_collection",
      [Query.orderDesc("search_count"), Query.limit(5)],
    );
  });

  it("returns the data from databases.listDocuments on success", async () => {
    const mockResponse = { total: 2, documents: [{ $id: "1" }, { $id: "2" }] };
    (databases.listDocuments as Mock).mockResolvedValue(mockResponse);

    const result = await getMetrics();

    expect(result).toEqual(mockResponse);
  });

  it("throws an error with message on failure", async () => {
    const errorMessage = "Network error";
    (databases.listDocuments as Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(getMetrics()).rejects.toThrow(
      `Error fetching metrics: Error: ${errorMessage}`,
    );
  });
});

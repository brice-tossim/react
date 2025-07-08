import { describe, expect, it, Mock, vi } from "vitest";
import { updateSearchCount } from "../../src/services";
import { databases } from "../../src/config/appwrite.config";
import { IMAGE_BASE_URL } from "../../src/config/constants";
import { Query } from "appwrite";

// Mock all external dependencies before importing the function under test
vi.mock("../../src/config/appwrite.config", () => ({
  databases: {
    listDocuments: vi.fn(),
    updateDocument: vi.fn(),
    createDocument: vi.fn(),
  },
  DATABASE_ID: "db",
  COLLECTION_ID: "col",
}));

vi.mock("../../src/config/constants", () => ({
  IMAGE_BASE_URL: "https://img/",
}));

vi.mock("appwrite", () => ({
  ID: { unique: vi.fn(() => "unique-id") },
  Query: {
    or: vi.fn(() => [
      { method: "equal", values: ["movie_id", 42] },
      { method: "equal", values: ["search_term", "hello"] },
    ]),
    equal: vi.fn((field, value) => ({
      method: "equal",
      values: [field, value],
    })),
  },
}));

describe("updateSearchCount", () => {
  const movie = {
    id: 42,
    title: "Test Movie",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    genre_ids: [1, 2, 3],
    vote_average: 7.5,
    original_language: "en",
    release_date: "2023-01-01",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates search count if document exists", async () => {
    const existingDoc = { $id: "doc1", search_count: 3 };
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 1,
      documents: [existingDoc],
    });

    await updateSearchCount("hello", movie);

    expect(Query.or).toHaveBeenCalledWith([
      { method: "equal", values: ["movie_id", movie.id] },
      { method: "equal", values: ["search_term", "hello"] },
    ]);
    expect(databases.listDocuments).toHaveBeenCalledWith("db", "col", [
      [
        { method: "equal", values: ["movie_id", movie.id] },
        { method: "equal", values: ["search_term", "hello"] },
      ],
    ]);
    expect(databases.updateDocument).toHaveBeenCalledWith("db", "col", "doc1", {
      search_count: 4,
    });
    expect(databases.createDocument).not.toHaveBeenCalled();
  });

  it("creates new document if none exists", async () => {
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 0,
      documents: [],
    });

    await updateSearchCount("findme", movie);

    expect(databases.updateDocument).not.toHaveBeenCalled();
    expect(databases.createDocument).toHaveBeenCalledWith(
      "db",
      "col",
      "unique-id",
      {
        search_term: "findme",
        movie_id: movie.id,
        movie_title: movie.title,
        search_count: 1,
        poster_path: `${IMAGE_BASE_URL}${movie.poster_path}`,
      },
    );
  });

  it("throws an error if listDocuments fails", async () => {
    (databases.listDocuments as Mock).mockRejectedValue(new Error("fail!"));

    await expect(updateSearchCount("err", movie)).rejects.toThrow(
      "Error updating search count: Error: fail!",
    );
    expect(databases.updateDocument).not.toHaveBeenCalled();
    expect(databases.createDocument).not.toHaveBeenCalled();
  });

  it("throws an error if updateDocument fails", async () => {
    const existingDoc = { $id: "doc2", search_count: 7 };
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 1,
      documents: [existingDoc],
    });
    (databases.updateDocument as Mock).mockRejectedValue(
      new Error("update failed"),
    );

    await expect(updateSearchCount("failupdate", movie)).rejects.toThrow(
      "Error updating search count: Error: update failed",
    );
    expect(databases.createDocument).not.toHaveBeenCalled();
  });

  it("throws an error if createDocument fails", async () => {
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 0,
      documents: [],
    });
    (databases.createDocument as Mock).mockRejectedValue(
      new Error("create failed"),
    );

    await expect(updateSearchCount("failcreate", movie)).rejects.toThrow(
      "Error updating search count: Error: create failed",
    );
  });

  it("handles empty search term", async () => {
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 0,
      documents: [],
    });
    (databases.createDocument as Mock).mockResolvedValue({});

    await updateSearchCount("", movie);

    expect(databases.createDocument).toHaveBeenCalledWith(
      "db",
      "col",
      "unique-id",
      {
        search_term: "",
        movie_id: movie.id,
        movie_title: movie.title,
        search_count: 1,
        poster_path: `${IMAGE_BASE_URL}${movie.poster_path}`,
      },
    );
  });

  it("handles movie without poster path", async () => {
    const movieWithoutPoster = { ...movie, poster_path: "" };
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 0,
      documents: [],
    });
    (databases.createDocument as Mock).mockResolvedValue({});

    await updateSearchCount("noposter", movieWithoutPoster);

    expect(databases.createDocument).toHaveBeenCalledWith(
      "db",
      "col",
      "unique-id",
      {
        search_term: "noposter",
        movie_id: movie.id,
        movie_title: movie.title,
        search_count: 1,
        poster_path: `${IMAGE_BASE_URL}`,
      },
    );
  });

  it("throws an error if createDocument fails", async () => {
    (databases.listDocuments as Mock).mockResolvedValue({
      total: 0,
      documents: [],
    });
    (databases.createDocument as Mock).mockRejectedValue(
      new Error("create failed"),
    );

    await expect(updateSearchCount("failcreate", movie)).rejects.toThrow(
      "Error updating search count: Error: create failed",
    );
    expect(databases.updateDocument).not.toHaveBeenCalled();
  });
});

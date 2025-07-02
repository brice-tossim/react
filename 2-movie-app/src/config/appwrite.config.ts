import { Client, Databases } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Initialize Appwrite Client
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

// Initialize Appwrite Databases
const databases = new Databases(client);

export { databases, DATABASE_ID, COLLECTION_ID };

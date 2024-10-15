// src/hooks/useDatabase.js
import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client;
let clientPromise;

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Please define the NEXT_PUBLIC_MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("Web3Domain");
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
  }
}

export { connectToDatabase, closeDatabase };

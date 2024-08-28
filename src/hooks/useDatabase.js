import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client;
let database;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, options);
    await client.connect();
    database = client.db("Web3Domain");
  }
  return database;
}

async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

export { connectToDatabase, closeDatabase };

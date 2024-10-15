// src/pages/api/message/update-notice.js
import { connectToDatabase } from '../../../hooks/useDatabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check if the API token is provided in the request header
  const apiToken = req.headers['api-token'];

  if (!apiToken || apiToken !== process.env.NEXT_PUBLIC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, notes } = req.body;

  if (!title || !notes) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  try {
    // Connect to the MongoDB database
    const db = await connectToDatabase();

    // Optionally, you can use MongoDB's ObjectId as the unique identifier
    // but since you have an ID field, we'll keep it
    const newID = Math.floor(Math.random() * 1000000); // Increased range to reduce collision

    // Get the current date and time in UTC
    const currentDate = new Date().toUTCString();

    // Create a new notice entry with consistent field names
    const newEntry = {
      ID: newID,
      Date: currentDate,
      Title: title,
      Message: notes,
    };

    // Insert the new entry into the "notices" collection
    const result = await db.collection('notices').insertOne(newEntry);

    if (result.acknowledged) {
      res.status(200).json({ message: 'Data updated successfully', id: result.insertedId });
    } else {
      throw new Error('Insertion failed');
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

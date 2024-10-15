// src/pages/api/message/get-notices.js
import { connectToDatabase } from '../../../hooks/useDatabase';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();
    const noticesCollection = db.collection('notices');
    const notices = await noticesCollection.find({}).sort({ Date: -1 }).toArray(); // Sort by latest

    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// src/pages/api/message/delete-notice.js
import { connectToDatabase } from '../../../hooks/useDatabase';

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check if the API token is provided in the request header
  const apiToken = req.headers['api-token'];

  if (!apiToken || apiToken !== process.env.NEXT_PUBLIC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const db = await connectToDatabase();
    const noticesCollection = db.collection('notices');

    const result = await noticesCollection.deleteOne({ ID: parseInt(id, 10) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: `Entry with ID ${id} deleted successfully` });
    } else {
      res.status(404).json({ error: `No entry found with ID ${id}` });
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

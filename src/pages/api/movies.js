// /src/pages/api/movies.js
import { connectToDatabase, closeDatabase } from '../../hooks/useDatabase';

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const movies = await db
      .collection("domain")
      .find({})
      .sort({ metacritic: -1 })
      .limit(10)
      .toArray();

    res.status(200).json({ movies });
  } catch (e) {
    console.error("Error in API route:", e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
}

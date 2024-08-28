// /src/pages/api/updateMovie.js
import { connectToDatabase, closeDatabase } from '../../hooks/useDatabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();
    //console.log('Connected to MongoDB:', db);

    if (!db) {
      throw new Error('Failed to connect to the database');
    }

    const { title,
      metacritic,
      plot,
      img,
      profile,
      email,
      website,
      notes,
      eth,
      bsc,
      matic,
      btc,
      fil,
      sol,
      twitter,
      telegram,
      youtube,
      instagram,
      facebook,
      page
    } = req.body;

    // Check if a document with the specified name exists
    const existingMovie = await db.collection("domain").findOne({ title });

    if (existingMovie) {
      // Update the existing document
      await db.collection("domain").updateOne(
        { title },
        {
          $set: {
            title,
            metacritic,
            plot,
            img,
            profile,
            email,
            website,
            notes,
            eth,
            bsc,
            matic,
            btc,
            fil,
            sol,
            twitter,
            telegram,
            youtube,
            instagram,
            facebook,
            page
          },
        }
      );
    } else {
      // Insert a new document if the name doesn't exist
      await db.collection("domain").insertOne({
        title,
        metacritic,
        plot,
        img,
        profile,
        email,
        website,
        notes,
        eth,
        bsc,
        matic,
        btc,
        fil,
        sol,
        twitter,
        telegram,
        youtube,
        instagram,
        facebook,
        page
      });
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error in updateMovie API route:", e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDatabase();
  }
}

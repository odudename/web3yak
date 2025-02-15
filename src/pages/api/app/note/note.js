import { connectToDatabase } from '../../../../hooks/useDatabase';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { action } = req.query;

  switch (action) {
    case 'delete-note':
      await deleteNoteHandler(req, res);
      break;
    case 'get-note':
      await getNoteHandler(req, res);
      break;
    case 'update-note':
      await updateNoteHandler(req, res);
      break;
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}

async function deleteNoteHandler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id } = req.query;
    const db = await connectToDatabase();
    const result = await db.collection('notices').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: `No entry found with ID ${id}` });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
}

async function getNoteHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();
    const notes = await db.collection('notices').find({}).sort({ Date: -1 }).toArray(); // Fetch all notes

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to get notes' });
  }
}

async function updateNoteHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id, title, notes } = req.body;
    const db = await connectToDatabase();

    if (id) {
      // Update existing note
      await db.collection('notices').updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, notes } }
      );
      res.status(200).json({ message: 'Note updated successfully' });
    } else {
      // Create new note
      await db.collection('notices').insertOne({ title, notes });
      res.status(200).json({ message: 'Note created successfully' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
}

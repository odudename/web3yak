// pages/api/message/delete-notice.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {

    // Check if the API token is provided in the request header
  const apiToken = req.headers['api-token'];

  if (!apiToken || apiToken !== process.env.NEXT_PUBLIC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
    
  if (req.method === 'DELETE') {
    try {
        const { id } = req.query;
      const entryID = id;
      console.log('Requested to delete entry with ID:', entryID);

      const filePath = path.join(process.cwd(), '/src/components/message/', 'PrivateNotice.json');
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log('Existing data:', existingData);

      const indexToRemove = existingData.findIndex((entry) => entry.ID === Number(entryID));
      console.log('Index to remove:', indexToRemove);

      if (indexToRemove !== -1) {
        existingData.splice(indexToRemove, 1);

        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
        console.log('Data updated successfully');

        res.status(200).json({ message: 'Entry deleted successfully' });
      } else {
        console.error('Entry not found');
        res.status(404).json({ error: 'Entry not found' });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

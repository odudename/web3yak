// pages/api/message/update-notice.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
        // Check if the API token is provided in the request header
  const apiToken = req.headers['api-token'];

  if (!apiToken || apiToken !== process.env.NEXT_PUBLIC_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  
  try {
    // Read the existing JSON data
    const filePath = path.join(process.cwd(), '/src/components/message/', 'PrivateNotice.json');
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Generate a random ID (for example)
    const newID = Math.floor(Math.random() * 1000);

    // Get the current date and time in UTC
    const currentDate = new Date().toUTCString();

    // Create a new entry
    const newEntry = {
      ID: newID,
      Date: currentDate,
      Title: req.body.title,
      Message: req.body.notes,
    };

    // Append the new entry to the existing data
    existingData.push(newEntry);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');

    res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

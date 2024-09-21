//To prevent from CORS policy
// pages/api/proxy.js
export default async function handler(req, res) {
    const { url } = req.query; // Get the URL from the query parameters
  
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Send the data back to the client
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching data" });
    }
  }
  
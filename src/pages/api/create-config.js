import fs from "fs";
import path from "path";
import axios from "axios";

export default async function handler(req, res) {
  const { config } = req.query;

  if (config) {
    try {
      const response = await axios.get(`http://localhost/blockchain/web3domain_org/endpoint/tln/${config}/${config}.tsx`);
      const fileContent = response.data;

      const filePath = path.join(process.cwd(), "src", "configuration", `${config}.tsx`);
      await fs.promises.writeFile(filePath, fileContent);

      res.status(200).json({ message: "Configuration Loaded" });
    } catch (error) {
      console.error("Error creating file:", error);
      res.status(500).json({ message: "Error creating file" });
    }
  } else {
    res.status(400).json({ message: "Config value is required" });
  }
}